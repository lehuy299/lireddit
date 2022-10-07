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

const main = async () => {;
    
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = createClient({ legacyMode: true });
    redisClient.connect().catch(console.error);

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({ 
                client: redisClient as any 
            }),
            saveUninitialized: false,
            secret: "gujhvugvutgjvfujuv",
            resave: false,
        })
    );


    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em })
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
