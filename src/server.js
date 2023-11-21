import { ApolloServer } from "apollo-server";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  AuthenticationError,
} from "apollo-server-core";

import typeDefs from "./graphql/schemaGql.js";
import resolvers from "./graphql/resolver.js";
import connectDB from "./database.js";
import config from "./config/index.js";
import jwt from "jsonwebtoken";

connectDB();

const context = ({ req }) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const { userId, role } = jwt.verify(authorization, config.jwt_secret);
      return { userId, role };
    } catch (error) {
      // Handle token verification errors, e.g., expired token, invalid signature
      throw new AuthenticationError("Invalid or expired token");
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
