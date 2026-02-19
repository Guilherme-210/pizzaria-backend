import prismaClient from "@/prisma";

interface IActivateProductRequest {
    id: string;
}

class ActivateProductService {
    async execute({ id }: IActivateProductRequest) {
        try {
            const product = await prismaClient.product.findUnique({
                where: { id },
            });
            if (!product) {
                return { status: 'error', message: 'Produto não encontrado' };
            }

            await prismaClient.product.update({
                where: { id },
                data: { disabled: false },
                select: {
                    name: true
                }
            });

            return { status: 'success', message: `${product.name} ativado com sucesso` };
        } catch (error) {
            return { status: 'error', message: 'Falha ao ativar produto' };
        }
    }
}

export { ActivateProductService };
