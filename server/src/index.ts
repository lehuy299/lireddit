import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from 'cors';
import express from "express";
import session from "express-session";
import expressPlayground from 'graphql-playground-middleware-express';
import Redis from "ioredis";
import 'reflect-metadata';
import { buildSchema } from "type-graphql";
import { DataSource } from 'typeorm';
import { COOKIE_NAME, __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { HelloResolver } from "./resolver/hello";
import { PostResolver } from "./resolver/post";
import { UserResolver } from './resolver/user';

const main = async () => {

    const conn = new DataSource({
        type: 'postgres',
        database: 'lireddit2',
        username: 'postgres',
        password: 'ngu123321',
        logging: true,
        synchronize: true,
        entities: [Post, User]
    });
    conn.initialize();

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis as any,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 1000, // 10 years
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__ // cookie only works in https
            },
            saveUninitialized: false,
            secret: "aojendoaeoijvfaedf",
            resave: false,
        })
    );


    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, redis, conn })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false })
    app.get(
        '/playground',
        expressPlayground({
          endpoint: '/graphql',
        }),
    );
    app.listen(4000, () => {
        console.log('server started on localhost:4000');
        
    });
};

main().catch(err => {
    console.log(err);
});
