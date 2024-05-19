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

export const consultaRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        page: z.number().default(1),
        searchMotivo: z.string().optional(),
        orderBy: z.enum(["fechaConsulta", "motivoConsulta"]).optional().default("fechaConsulta"),
        orderDirection: z.enum(["asc", "desc"]).optional().default("asc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        limit,
        page,
        searchMotivo,
        orderBy,
        orderDirection,
      } = input;
      const offset = (page - 1) * limit;

      const whereClause: Prisma.ConsultaWhereInput = {
        motivoConsulta: {
          contains: searchMotivo,
        },
      };

      const consultas = await ctx.db.consulta.findMany({
        where: whereClause,
        orderBy: {
          [orderBy]: orderDirection,
        },
        skip: offset,
        take: limit,
      });

      const total = await ctx.db.consulta.count({
        where: whereClause,
      });

      return {
        data: consultas,
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

      // Get the consultation by its ID
      const consulta = await ctx.db.consulta.findUnique({
        where: { id: input.id },
      });

      if (!consulta) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Consulta not found",
        });
      }

      return consulta;
    }),

    create: protectedProcedure
    .mutation(async ({ input, ctx }) => {
      if (!input) {
        throw new Error("Input parameter is missing");
      }
      
      // Create the consultation
      const nuevaConsulta = await ctx.db.consulta.create({
        data: input,
        select: {
          id: true,
          paciente: true,
          idPaciente: true,
          doctor: true,
          idDoctor: true,
          fechaConsulta: true,
          motivoConsulta: true,
          diagnostico: true,
          tratamiento: true,
          proximaCita: true,
        },
      });

      return nuevaConsulta;
    }),

    delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Delete the consultation by its ID
        const consulta = await ctx.db.consulta.delete({
          where: { id: input.id },
        });

        // Verify if the consultation was found and deleted
        if (!consulta) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Consulta not found",
          });
        }

        // Return the deleted consultation
        return consulta;
      } catch (error) {
        // If an error occurs during the deletion, throw an internal server error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while deleting the Consulta",
        });
      }
    }),
});