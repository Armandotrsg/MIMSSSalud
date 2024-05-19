import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { OpenAI } from "openai";

// Define el cliente de OpenAI GPT
const gpt = new OpenAI({
  apiKey: "your-api-key",
});

// Define el esquema de entrada para la consulta
const getLastThreeConsultationsInputSchema = z.object({
  pacienteId: z.string(),
});

// Define una interfaz para el tipo de datos de las consultas
interface Consultation {
  fechaConsulta: Date;
  motivoConsulta: string;
}

// Define el procedimiento protegido para obtener las últimas consultas del paciente
export const getLastThreeConsultations = protectedProcedure
  .input(getLastThreeConsultationsInputSchema)
  .query(async ({ input, ctx }) => {
    try {
      // Obtén las últimas consultas del paciente
      const lastThreeConsultations = await ctx.db.consulta.findMany({
        where: {
          paciente: {
            id: input.pacienteId,
          },
        },
        orderBy: {
          fechaConsulta: "desc",
        },
        take: 3,
        include: {
          paciente: true,
          doctor: true,
        },
      });

      // Generar un resumen usando ChatGPT
      const summary = await generateSummary(lastThreeConsultations);

      // Devolver un objeto que incluya las últimas consultas y el resumen
      return { lastThreeConsultations, summary };
    } catch (error) {
      // Si ocurre un error, lanzar un error de servidor interno
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching last consultations",
      });
    }
  });
// Generar un resumen utilizando ChatGPT
async function generateSummary(consultations: Consultation[]): Promise<string> {
    try {
      // Crear un array de strings con la información de las consultas
      const consultationsText = consultations.map((consultation) => {
        const formattedDate = consultation.fechaConsulta.toISOString().split('T')[0];
        return `${formattedDate}: ${consultation.motivoConsulta}`;
      });
  
      const textToSummarize = consultationsText.join("\n");
  
      // Generar un resumen utilizando ChatGPT
      const response = await gpt.completions.create({
        model: "text-davinci-003",
        prompt: `Please summarize the following consultations:\n${textToSummarize}`,
        max_tokens: 100,  
      });
  
      // Verificar si la respuesta contiene el resumen esperado
      const summary = response?.choices?.[0]?.text?.trim();
  
      if (summary) {
        return summary;
      } else {
        throw new Error("No summary generated");
      }
    } catch (error: unknown) {
      // Manejar errores en la generación del resumen
      if (error instanceof Error) {
        throw new Error("Error generating summary: " + error.message);
      } else {
        throw new Error("Unknown error generating summary");
      }
    }
  }
  