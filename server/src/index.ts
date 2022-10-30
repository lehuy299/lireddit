import 'reflect-metadata'
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from 'cors';
import { buildSchema } from "type-graphql";
import mikroConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolver/hello";
import expressPlayground from 'graphql-playground-middleware-express';
import { PostResolver } from "./resolver/post";
import { UserResolver } from './resolver/user';
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { COOKIE_NAME, __prod__ } from './constants';

const main = async () => {;
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

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
        context: ({ req, res }) => ({ em: orm.em, req, res, redis })
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
