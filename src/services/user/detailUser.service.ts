import prismaClient from "@/prisma";

class DetailUserService {
    async execute(userId: string) {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }
}

export { DetailUserService };