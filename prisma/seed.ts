/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        nombre: "John",
        apellidoPaterno: "Doe",
        apellidoMaterno: "Smith",
        email: "a@a.com",
        password: await bcrypt.hash("pass", 10),
        curp: "CURP1234",
        especialidad: "Specialty",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
