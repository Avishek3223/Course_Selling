export const typeDefs = `
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
