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
// import qrCode from "qrcode-terminal";
// import Whatsapp from "whatsapp-web.js";
// const { Client, LocalAuth } = Whatsapp;

connectDB();

// const client = new Client({
//   // session: createSession(),
//   // authScope: "openid",
//   authStrategy: new LocalAuth(),
// });

// client.on("qr", (qr) => {
//   qrCode.generate(qr, {
//     small: true,
//   });
//   // console.log("Scan the QR code:", qrCode);
// });

// client.on("message", async (message) => {
//   const msg = message.body;
//   if (
//     msg === "hello" ||
//     msg === "HELLO" ||
//     msg === "Hello" ||
//     msg === "Hi" ||
//     msg === "hi" ||
//     msg === "namaste" ||
//     msg === "nomoskar" ||
//     "Namaste" ||
//     msg === "Nomoskar"
//   ) {
//     message.reply("Hello this is Palas from OM EPC SOLUTION")
//   }
// });

// client.on("ready", () => {
//   const clientState = client.getState();
//   console.log("Client state:", clientState);
//   console.log("client is ready");

//   const phoneNumberToSendMessage = "+917872358979";

//   const messageToSend = "Hello this is Palas from OM EPC SOLUTION";

//   // Send a message to the specified phone number
//   client
//     .sendMessage(phoneNumberToSendMessage, messageToSend)
//     .then((response) => {
//       console.log("Message sent successfully:", response);
//     })
//     .catch((error) => {
//       console.error("Error sending message:", error);
//     });
// });

// client.on("ready", () => {
//   console.log("client is ready");
// });

// client.initialize();

// const createWhatsAppClient = async () => {

//   // client.on("authenticated", (session) => {
//   //   // Handle successful authentication, e.g., save session data
//   //   console.log("Authenticated as", session);
//   // });

//   // client.on("message", (message) => {
//   //   // Handle incoming messages
//   //   console.log("New message:", message.body);
//   // });

//   await client.initialize();
//   return client;
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

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
