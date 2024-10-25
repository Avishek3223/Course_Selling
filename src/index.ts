import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { server } from "./server/apolloServer";

// Initialize Express app
const app: Express = express();
app.use(bodyParser.json());
app.use(cors());

// Start the server
const startServer = async () => {
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000/graphql`);
  });
};

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
