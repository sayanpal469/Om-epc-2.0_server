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
import qrCode from "qrcode-terminal";
import Whatsapp from "whatsapp-web.js";
const { Client, LocalAuth } = Whatsapp;

connectDB();

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrCode.generate(qr, {
    small: true,
  });
});


client.on("ready", () => {
  const clientState = client.getState();
  // console.log("Client state:", clientState);
  console.log("client is ready");

  const phNumber = "+919674484503";

  const messageToSend = "Hello this is Palas from OM EPC SOLUTION";

  const chatId = phNumber.substring(1) + "@c.us";

  client
    .sendMessage(chatId, messageToSend)
    .then((response) => {
      console.log("Message sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
});


client.initialize();


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

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
