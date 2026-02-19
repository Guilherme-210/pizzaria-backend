import prismaClient from "@/prisma";

interface IGetProductRequest {
    id: string;
}

class GetProductService {
    async execute({ id }: IGetProductRequest) {
        try {
            const product = await prismaClient.product.findUnique({
                where: { id },
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
            });

            return { status: 'success', data: product };
        } catch (error) {
            return { status: 'error', message: 'Falha ao obter produto' };
        }
    }
}

export { GetProductService };