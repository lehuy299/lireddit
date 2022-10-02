
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import mikroConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolver/hello";
import expressPlayground from 'graphql-playground-middleware-express';

const main = async () => {;
    
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false,

        })
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
