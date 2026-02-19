import prismaClient from "@/prisma";

interface IEditCategoryRequest {
    id: string;
    name: string;
}

class editCategoryService {
    async execute({ id, name }: IEditCategoryRequest) {
        try {
            const existingCategory = await prismaClient.category.findUnique({
                where: { id }
            });
            if (!existingCategory) {
                return { status: 'error', message: 'Categoria não encontrada', statusCode: 404 };
            }

            const nameExists = await prismaClient.category.findFirst({
                where: { name, NOT: { id } }
            });
            if (nameExists) {
                return { status: 'error', message: 'Já existe uma categoria com esse nome', statusCode: 400 };
            }

            const category = await prismaClient.category.update({
                where: { id },
                data: { name },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return { status: 'success', data: category };
        } catch (error) {
            return { status: 'error', message: 'Falha ao editar categoria' };
        }
    }
}

export { editCategoryService };
