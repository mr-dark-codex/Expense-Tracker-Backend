import { PrismaClient } from "../generated/prisma/client";

export const prisma = new PrismaClient();

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
