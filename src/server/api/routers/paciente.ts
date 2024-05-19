import { z } from "zod";

import { type Prisma } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure
} from "@/server/api/trpc";

import { TRPCError } from "@trpc/server";

const getByIdInputSchema = z.object({
  id: z.string(), // Esperamos que id sea una cadena
});

/**
 * El enrutador para las operaciones relacionadas con los pacientes
 */
export const pacienteRouter = createTRPCRouter({
  /**
   * @brief Procedimiento tRPC para obtener todos los pacientes.
   * Este procedimiento no toma ninguna entrada.
   * Consulta la base de datos para obtener todos los pacientes.
   * Devuelve un array de pacientes.
   *
   * @returns {Array} Un array de pacientes.
   */
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        page: z.number().default(1),
        searchName: z.string().optional(),
        orderBy: z.enum(["nombre", "apellidoPaterno", "apellidoMaterno", "curp", "nss"]).optional().default("nombre"),
        orderDirection: z.enum(["asc", "desc"]).optional().default("asc"),
      })
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
      const whereClause: Prisma.PacienteWhereInput = {
        OR: [
          {
            nombre: {
              contains: searchName,
            },
          },
          {
            apellidoPaterno: {
              contains: searchName,
            },
          },
          {
            apellidoMaterno: {
              contains: searchName,
            },
          },
          {
            curp: {
              contains: searchName,
            },
          },
        ],
      };

      const pacientes = await ctx.db.paciente.findMany({
        where: whereClause,
        orderBy: {
          [orderBy]: orderDirection,
        },
        skip: offset,
        take: limit,
        select: {
          id: true,
          nombre: true,
          apellidoPaterno: true,
          apellidoMaterno: true,
          fechaNacimiento: true,
          curp: true,
          nss: true,
          sexo: true,
          padecimientosHereditarios: true,
        },
      });

      const total = await ctx.db.paciente.count({
        where: whereClause,
      });

      return {
        data: pacientes,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / limit),
        },
      };
    }),
  
  /**
   * @brief Procedimiento tRPC para obtener un paciente por su ID.
   * Toma un parámetro de entrada `id` que representa el ID del paciente.
   * Consulta la base de datos para obtener el paciente correspondiente al ID proporcionado.
   * Devuelve el paciente encontrado.
   *
   * @param {String} input.id El ID del paciente.
   * @returns {Object} El paciente encontrado.
   */
  getById: protectedProcedure
    .input(getByIdInputSchema) // Especificar el esquema de entrada
    .query(async ({ input, ctx }) => {
      // Obtener el paciente por su ID
      const paciente = await ctx.db.paciente.findUnique({
        where: { id: input.id },
      });

      if (!paciente) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Paciente not found",
        });
      }

      return paciente;
    }),

  /**
   * @protected
   * Crea un nuevo paciente en la base de datos.
   * Toma los datos del paciente como entrada y los guarda en la base de datos.
   * Devuelve el paciente recién creado.
   *
   * @param {Object} input Los datos del paciente a crear.
   * @returns {Object} El paciente recién creado.
   */

  create: protectedProcedure
  .input(
    z.object({
      nombre: z.string(),
      apellidoPaterno: z.string(),
      apellidoMaterno: z.string(),
      fechaNacimiento: z.date(),
      curp: z.string(),
      nss: z.string(),
      sexo: z.enum(["MASCULINO", "FEMENINO"]),
      padecimientosHereditarios: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    
    // Extraer los datos del paciente del objeto de entrada
    const { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, curp, nss, sexo, padecimientosHereditarios } = input;
  
  

      // Crear un nuevo paciente utilizando la función de Prisma create
      const nuevoPaciente = await ctx.db.paciente.create({
        data: {
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          fechaNacimiento,
          curp,
          nss,
          sexo,
          padecimientosHereditarios,
        },
      });
      
      // Devolver el paciente recién creado
      return nuevoPaciente;

  }),
  
/**
   * @protected
   * Elimina un paciente existente de la base de datos.
   * Toma el ID del paciente como entrada y lo elimina de la base de datos.
   * Devuelve el paciente eliminado.
   *
   * @param {string} id El ID del paciente a eliminar.
   * @returns {Paciente} El paciente eliminado.
   * @throws {TRPCError} Si el paciente no se encuentra o si no está autorizado.
   * @since 2024-02-03
   * @version 1.0.0
   * @autor Tu Nombre
   */
delete: protectedProcedure
.input(z.object({ id: z.string() }))
.mutation(async ({ ctx, input }) => {
  try {
    // Verificar si el paciente existe antes de intentar eliminarlo
    const paciente = await ctx.db.paciente.findUnique({
      where: { id: input.id },
    });

    if (!paciente) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Paciente not found",
      });
    }

    // Eliminar el paciente por su ID
    const pacienteEliminado = await ctx.db.paciente.delete({
      where: { id: input.id },
    });

    // Devolver el paciente eliminado
    return pacienteEliminado;
  } catch (error) {
    // Capturar errores específicos y devolver mensajes adecuados
    if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `An error occurred while deleting the Paciente: ${(error as Error).message}`,
      });
    }
  }
}),
  
});
