import prismaClient from "@/prisma";

interface ICreateCategoryService {
    name: string;
}

class createCategoryService {
    async execute({ name }: ICreateCategoryService) {
        try {
            const existingCategory = await prismaClient.category.findUnique({
                where: {
                    name
                }
            });

            if (existingCategory) {
                return { status: 'error', message: 'Categoria já existe', statusCode: 400 };
            }

            const category = await prismaClient.category.create({
                data: {
                    name
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                }
            });

            return { status: 'success', data: category };
        } catch (error) {
            return { status: 'error', message: 'Falha ao criar categoria' };
        }
    }
}

export { createCategoryService };