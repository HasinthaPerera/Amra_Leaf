import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client singleton instance to prevent multiple connections
 * during Next.js hot module replacement (HMR) in development.
 * 
 * IMPORTANT: This file must ONLY be imported by server-side modules
 * (API route handlers, Server Actions, or Server Components).
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
