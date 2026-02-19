import prismaClient from "@/prisma";

class listCategoriesService {
    async execute() {
        try {
            const categories = await prismaClient.category.findMany({
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: {
                    name: 'asc'
                }
            });

            return { status: 'success', data: categories };
        } catch (error) {
            return { status: 'error', message: 'Falha ao listar categorias' };
        }
    }
}

export { listCategoriesService };
