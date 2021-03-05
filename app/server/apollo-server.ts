import { ApolloServer, gql } from "apollo-server-express";
import { WebApp } from "meteor/webapp";

import { schema } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  introspection: true,
  debug: false,
  playground: true,

  //   context: async ({ req }) => ({
  //     user: await getUser(req.headers.authorization)
  //   })
});

server.applyMiddleware({
  app: WebApp.connectHandlers,
  path: "/graphql",
});

WebApp.connectHandlers.use("/graphql", (req, res) => {
  if (req.method === "GET") {
    res.end();
  }
});
