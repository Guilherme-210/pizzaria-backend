import prismaClient from "@/prisma";

interface ISearchProductRequest {
    search: string;
}

class SearchProductsService {
    async execute({ search }: ISearchProductRequest) {
        try {
            // const searchTerm = search;
            // const searchTerm = search.trim();

            const products = await prismaClient.product.findMany({
                where: {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    }
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
            return { status: 'error', message: 'Falha ao buscar produtos' };
        }
    }
}

export { SearchProductsService };