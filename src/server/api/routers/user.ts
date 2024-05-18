import { z } from "zod";

import { Prisma, PrismaClient } from "@prisma/client";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure
} from "@/server/api/trpc";

import { TRPCError } from "@trpc/server";

// Instantiate Prisma Client
const prisma = new PrismaClient();

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        page: z.number().default(1),
        searchName: z.string().optional(),
        orderBy: z.enum(["nombre", "email"]).optional().default("nombre"),
        orderDirection: z.enum(["asc", "desc"]).optional().default("asc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        limit,
        page,
        searchName,
        orderBy,
        orderDirection,
      } = input;
      const offset = (page - 1) * limit;

      const whereClause: Prisma.UserWhereInput = {
        OR: searchName
          ? [
              { nombre: { contains: searchName } },
              { apellidoPaterno: { contains: searchName } },
              { apellidoMaterno: { contains: searchName } },
              { curp: { contains: searchName } },
              { email: { contains: searchName } },
            ]
          : undefined,
      };

      const users = await ctx.db.user.findMany({
        where: whereClause,
        orderBy: {
          [orderBy]: orderDirection,
        },
        skip: offset,
        take: limit,
      });

      const total = await ctx.db.user.count({
        where: whereClause,
      });

      return {
        data: users,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / limit),
        },
      };
    }),

    getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Verify if input is valid
      if (!input || !input.id) {
        throw new Error("ID parameter is missing");
      }

      // Get the user by their ID
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

    create: protectedProcedure
    .mutation(async ({ input, ctx }) => {
      if (!input) {
        throw new Error("Input parameter is missing");
      }
      
      // Create the user
      const nuevoUsuario = await ctx.db.user.create({
        data: input,
        select: {
          id: true,
          nombre: true,
          apellidoPaterno: true,
          apellidoMaterno: true,
          password: true,
          curp: true,
          especialidad: true,
          email: true,
          emailVerified: true,
          image: true,
          accounts: true,
          sessions: true,
          consultas: true,
        },
      });

      return nuevoUsuario;
    }),

    delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Delete the user by their ID
        const user = await ctx.db.user.delete({
          where: { id: input.id },
        });

        // Verify if the user was found and deleted
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Return the deleted user
        return user;
      } catch (error) {
        // If an error occurs during the deletion, throw an internal server error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while deleting the User",
        });
      }
    }),
});
