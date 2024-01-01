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
// import { createReadStream } from "fs";
// import { resolve } from "path";
// import qrCode from "qrcode-terminal";
// import Whatsapp from "whatsapp-web.js";
// const { Client, LocalAuth, NoAuth } = Whatsapp;

connectDB();

// export const client = new Client({
//   authStrategy: new NoAuth(),
// });

// export const generateQRCode = () => {
//   return new Promise((resolve, reject) => {
//     client.on("qr", (qr) => {
//       resolve(qr);
//       // const code = qrCode.generate(qr, {small: true})
//       // console.log(code)
//     });
//   });
// };

const context = async ({ req }) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const { userId, role, admin, engineer } = jwt.verify(
        authorization,
        config.jwt_secret
      );
      // const whatsappClient = await createWhatsAppClient();

      return { userId, role, admin, engineer };
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

// client.initialize();

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
