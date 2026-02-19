import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Create and export Prisma client with the adapter
export const prisma = new PrismaClient({ adapter });
