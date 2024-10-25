import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../schema/typeDefs";
import { resolvers } from "../schema/resolvers";

export const server = new ApolloServer({
  typeDefs,
  resolvers,
});
