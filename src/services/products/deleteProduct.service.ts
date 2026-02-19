import prismaClient from "@/prisma";

interface IDeleteProductRequest {
    id: string;
}

class DeleteProductService {
    async execute({ id }: IDeleteProductRequest) {
        try {
            const product = await prismaClient.product.findUnique({
                where: { id },
            });
            if (!product) {
                return { status: 'error', message: 'Produto não encontrado' };
            }

            await prismaClient.product.delete({
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

            return { status: 'success', message: `${product.name} deletado com sucesso`, data: product };
        } catch (error) {
            return { status: 'error', message: 'Falha ao deletar produto' };
        }
    }
}

export { DeleteProductService };
