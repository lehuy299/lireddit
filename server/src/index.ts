import 'reflect-metadata'
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import mikroConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolver/hello";
import expressPlayground from 'graphql-playground-middleware-express';
import { PostResolver } from "./resolver/post";
import { UserResolver } from './resolver/user';

import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import { __prod__ } from './constants';
import { MyContext } from './types';

const main = async () => {;
    
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();

    let RedisStore = connectRedis(session)
    let redisClient = createClient({ legacyMode: true })
    redisClient.connect().catch(console.error)
    
    app.use(
        session({
            store: new RedisStore({ 
                client: redisClient as any,
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
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app })
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
