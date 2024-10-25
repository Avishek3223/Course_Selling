import express, { Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import { prisma } from "./lib/db";

// Initialize Express app
const app: Express = express();

app.use(bodyParser.json());
app.use(cors());

// Initialize Prisma Client

// Define GraphQL schema
const typeDefs = `
  type Course {
    id: ID!
    course_name: String!
    description: String
    created_at: String
  }

  type Query {
    courses: [Course]
    course(id: ID!): Course
  }

  type Mutation {
    addCourse(course_name: String!, description: String): Course
    updateCourse(id: ID!, course_name: String!, description: String): Course
    deleteCourse(id: ID!): Course
  }
`;

// Define GraphQL resolvers
const resolvers = {
  Query: {
    courses: async () => {
      return await prisma.course.findMany();
    },
    course: async (_: any, { id }: { id: string }) => {
      return await prisma.course.findUnique({ where: { id: Number(id) } });
    },
  },
  Mutation: {
    addCourse: async (
      _: any,
      { course_name, description }: { course_name: string; description: string }
    ) => {
      return await prisma.course.create({
        data: { course_name, description },
      });
    },
    updateCourse: async (
      _: any,
      { id, course_name, description }: { id: string; course_name: string; description: string }
    ) => {
      return await prisma.course.update({
        where: { id: Number(id) },
        data: { course_name, description },
      });
    },
    deleteCourse: async (_: any, { id }: { id: string }) => {
      return await prisma.course.delete({ where: { id: Number(id) } });
    },
  },
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

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
