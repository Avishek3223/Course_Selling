import express, { Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import { Pool } from "pg";

// Initialize Express app
const app: Express = express();

app.use(bodyParser.json());
app.use(cors());

// PostgreSQL Pool Configuration
const pool = new Pool({
  user: "postgres", // Replace with your PostgreSQL username
  host: "localhost", // The server's host
  database: "Course_Management_System", // Replace with your PostgreSQL database name
  password: "postgres", // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

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
      const result = await pool.query("SELECT * FROM courses");
      return result.rows;
    },
    course: async (_: any, { id }: { id: string }) => {
      const result = await pool.query("SELECT * FROM courses WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    },
  },

  Mutation: {
    addCourse: async (
      _: any,
      { course_name, description }: { course_name: string; description: string }
    ) => {
      const result = await pool.query(
        "INSERT INTO courses (course_name, description) VALUES ($1, $2) RETURNING *",
        [course_name, description]
      );
      return result.rows[0];
    },
    updateCourse: async (
      _: any,
      { id, course_name, description }: { id: string; course_name: string; description: string }
    ) => {
      const result = await pool.query(
        'UPDATE courses SET course_name = $1, description = $2 WHERE id = $3 RETURNING *',
        [course_name, description, id]
      );
      return result.rows[0];
    },
    deleteCourse: async (_: any, { id }: { id: string }) => {
      const result = await pool.query(
        'DELETE FROM courses WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
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
