import { Readable } from "node:stream";
import prismaClient from "@/prisma";
import cloudinary from "@/configs/cloudinary";

interface IEditProductRequest {
    id: string;
    name?: string;
    price?: string;
    description?: string;
    category_id?: string;
    disabled?: string;
    fileBuffer?: Buffer;
    fileName?: string;
    banner_url?: string;
}

class EditProductService {
    async execute({ id, name, price, description, category_id, disabled, fileBuffer, fileName, banner_url }: IEditProductRequest) {
        // Verificar se o produto existe
        const existingProduct = await prismaClient.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            return { status: 'error', message: 'Produto não encontrado', statusCode: 404 };
        }

        // Se houver category_id, verificar se a categoria existe
        if (category_id) {
            const categoryExists = await prismaClient.category.findUnique({
                where: { id: category_id },
            });
            if (!categoryExists) {
                return { status: 'error', message: 'Categoria não encontrada', statusCode: 404 };
            }
        }

        // Se o nome foi atualizado, verificar se já existe outro produto com esse nome
        if (name && name !== existingProduct.name) {
            const productWithSameName = await prismaClient.product.findFirst({
                where: { name: name.trim() },
            });
            if (productWithSameName) {
                return { status: 'error', message: 'Produto com esse nome já existe', statusCode: 400 };
            }
        }

        // Preparar dados para Update
        const updateData: any = {};

        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (price) updateData.price = parseFloat(price.toString());
        if (category_id) updateData.category_id = category_id;
        if (disabled !== undefined) {
            updateData.disabled = disabled === 'true' ? true : disabled === 'false' ? false : existingProduct.disabled;
        }

        // Se foi fornecida uma URL de banner, usar direto
        if (banner_url) {
            updateData.banner = banner_url;
            console.log('Usando URL de banner fornecida:', banner_url);
        } else if (fileBuffer && fileName) {
            // Se houver arquivo, fazer upload para Cloudinary
            try {
                const result = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'products',
                            resource_type: 'image',
                            public_id: `${Date.now()}-${fileName.split('.')[0]}`,
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );

                    const bufferStream = Readable.from(fileBuffer);
                    bufferStream.pipe(uploadStream);
                });

                updateData.banner = result.secure_url;
                console.log('Upload bem-sucedido. URL da imagem:', result.secure_url);
            } catch (error) {
                return { status: 'error', message: 'Falha ao fazer upload da imagem', statusCode: 500 };
            }
        }

        // Atualizar produto
        const updatedProduct = await prismaClient.product.update({
            where: { id },
            data: updateData,
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
            },
        });

        return { status: 'success', data: updatedProduct };
    }
}

export { EditProductService };
