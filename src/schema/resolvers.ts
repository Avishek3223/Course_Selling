import { prisma } from "../lib/db";

export const resolvers = {
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
      {
        id,
        course_name,
        description,
      }: { id: string; course_name: string; description: string }
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
