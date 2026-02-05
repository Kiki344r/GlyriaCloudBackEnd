// config/index.ts
import "./Redis"; // ← Force l'exécution du module Redis
import "./Prisma"; // ← Force l'exécution du module Prisma

export { redis } from "./Redis";
export { prisma } from "./Prisma";