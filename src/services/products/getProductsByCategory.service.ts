import prismaClient from "@/prisma";

interface IGetProductsByCategoryRequest {
    category_id: string;
}

class GetProductsByCategoryService {
    async execute({ category_id }: IGetProductsByCategoryRequest) {
        try {
            // Verificar se a categoria existe
            const categoryExists = await prismaClient.category.findUnique({
                where: { id: category_id }
            });

            if (!categoryExists) {
                return { status: 'error', message: 'Categoria não encontrada' };
            }

            // Buscar produtos da categoria
            const products = await prismaClient.product.findMany({
                where: {
                    category_id: category_id,
                    disabled: false
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                    disabled: true,
                    category_id: true,
                    createdAt: true,
                    updatedAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
                orderBy: {
                    name: 'asc',
                },
            });

            return { status: 'success', data: products };
        } catch (error) {
            return { status: 'error', message: 'Falha ao buscar produtos da categoria' };
        }
    }
}

export { GetProductsByCategoryService };
