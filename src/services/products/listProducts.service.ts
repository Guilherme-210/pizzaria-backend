import prismaClient from "@/prisma";

interface IListProductsRequest {
    disabled?: string;
}

class ListProductsService {
    async execute({ disabled }: IListProductsRequest) {
        try {
            // Mapear a query parameter para booleano
            const disabledFilter = disabled === 'true' ? true : disabled === 'false' ? false : undefined;

            // Construir o filtro dinamicamente
            const whereFilter = disabledFilter !== undefined ? { disabled: disabledFilter } : {};

            const products = await prismaClient.product.findMany({
                where: whereFilter,
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

export { ListProductsService };
