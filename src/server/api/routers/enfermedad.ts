import { z } from "zod";

import { Prisma } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure
} from "@/server/api/trpc";

import { TRPCError } from "@trpc/server";

export const enfermedadRouter = createTRPCRouter({
    getAll: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          page: z.number().default(1),
          searchNombre: z.string().optional(),
          orderBy: z.enum(["nombre", "descripcion"]).optional().default("nombre"),
          orderDirection: z.enum(["asc", "desc"]).optional().default("asc"),
        }),
      )
      .query(async ({ ctx, input }) => {
        const {
          limit,
          page,
          searchNombre,
          orderBy,
          orderDirection,
        } = input;
        const offset = (page - 1) * limit;
  
        const whereClause: Prisma.EnfermedadWhereInput = {
          nombre: {
            contains: searchNombre,
          },
        };
  
        const enfermedades = await ctx.db.enfermedad.findMany({
          where: whereClause,
          orderBy: {
            [orderBy]: orderDirection,
          },
          skip: offset,
          take: limit,
        });
  
        const total = await ctx.db.enfermedad.count({
          where: whereClause,
        });
  
        return {
          data: enfermedades,
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
      if (!input?.id) {
        throw new Error("ID parameter is missing");
      }

      // Get the disease by its ID
      const enfermedad = await ctx.db.enfermedad.findUnique({
        where: { id: input.id },
      });

      if (!enfermedad) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Enfermedad not found",
        });
      }

      return enfermedad;
    }),

    create: protectedProcedure
    .mutation(async ({ input, ctx }) => {
      // Ensure input is defined
      if (!input) {
        throw new Error("Input parameter is missing");
      }

      // Create the disease
      const nuevaEnfermedad = await ctx.db.enfermedad.create({
        data: input,
        select: {
          id: true,
          paciente: true,
          idPaciente: true,
          nombre: true,
          descripcion: true,
          sintomas: true,
          tratamiento: true,
        },
      });

      return nuevaEnfermedad;
    }),

    delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Delete the disease by its ID
        const enfermedad = await ctx.db.enfermedad.delete({
          where: { id: input.id },
        });

        // Verify if the disease was found and deleted
        if (!enfermedad) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Enfermedad not found",
          });
        }

        // Return the deleted disease
        return enfermedad;
      } catch (error) {
        // If an error occurs during the deletion, throw an internal server error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while deleting the Enfermedad",
        });
      }
    }),

});
  