import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function cleanupUser(user: any) {
    const { password, ...rest } = user;
    return rest;
}

export { prisma, cleanupUser };
