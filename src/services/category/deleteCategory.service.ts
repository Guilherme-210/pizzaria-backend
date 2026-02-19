import prismaClient from "@/prisma";

interface IDeleteCategoryService {
    id: string;
}

class deleteCategoryService {
    async execute({ id }: IDeleteCategoryService) {
        try {
            const existingCategory = await prismaClient.category.findUnique({
                where: {
                    id
                }
            });

            if (!existingCategory) {
                return { status: 'error', message: 'Categoria não encontrada', statusCode: 404 };
            }

            const category = await prismaClient.category.delete({
                where: {
                    id
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                }
            });

            return { status: 'success', data: category };
        } catch (error) {
            return { status: 'error', message: 'Falha ao deletar categoria' };
        }
    }
}

export { deleteCategoryService };