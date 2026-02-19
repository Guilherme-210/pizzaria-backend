import prismaClient from "@/prisma";

interface IDisableProductRequest {
    id: string;
}

class DisableProductService {
    async execute({ id }: IDisableProductRequest) {
        try {
            const product = await prismaClient.product.findUnique({
                where: { id },
            });
            if (!product) {
                return { status: 'error', message: 'Produto não encontrado' };
            }

            await prismaClient.product.update({
                where: { id },
                data: { disabled: true },
                select: {
                    name: true,
                },
            });

            return { status: 'success', message: `${product.name} desativado com sucesso` };
        } catch (error) {
            return { status: 'error', message: 'Falha ao desativar produto' };
        }
    }
}

export { DisableProductService };
