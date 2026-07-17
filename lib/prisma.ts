import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {DATABASE_URL} from "@/db/config";
declare global {
	var prisma: PrismaClient | undefined;
}

const _global = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaMariaDb(DATABASE_URL);

const prisma = _global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') _global.prisma = prisma;

export default prisma;