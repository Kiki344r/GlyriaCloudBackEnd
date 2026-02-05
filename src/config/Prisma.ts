// config/prisma.ts
import { PrismaClient } from '@prisma/client';

// Instance directe (pas de fonction)
export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
});

// Optionnel : fonction de fermeture
export async function closePrisma(): Promise<void> {
    await prisma.$disconnect();
}