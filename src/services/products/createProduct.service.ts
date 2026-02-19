import { Readable } from "node:stream";
import prismaClient from "@/prisma";
import cloudinary from "@/configs/cloudinary";

interface ICreateProductRequest {
    name: string;
    description: string;
    price: number;
    category_id: string;
    fileBuffer?: Buffer;
    fileName?: string;
    banner_url?: string;
}

class CreateProductService {
    async execute({ name, description, price, category_id, fileBuffer, fileName, banner_url }: ICreateProductRequest) {
        const categoryExists = await prismaClient.category.findUnique({
            where: { id: category_id },
        });
        if (!categoryExists) {
            return { status: 'error', message: 'Categoria não encontrada', statusCode: 404 };
        }

        const existingProduct = await prismaClient.product.findFirst({
            where: { name: name.trim() },
        });
        if (existingProduct) {
            return { status: 'error', message: 'Produto com esse nome já existe', statusCode: 400 };
        }

        // Determinar qual URL de banner usar
        let bannerUrl = '';

        // Se foi fornecida uma URL de banner, usar direto
        if (banner_url) {
            bannerUrl = banner_url;
            console.log('Usando URL de banner fornecida:', bannerUrl);
        } else if (fileBuffer && fileName) {
            // Caso contrário, fazer upload para o Cloudinary
            try {
                const result = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'products',
                            resource_type: 'image',
                            public_id: `${Date.now()}-${fileName.split('.')[0]}`, // Nome do arquivo sem extensão 
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    )

                    // Criar um stream legível a partir do buffer do arquivo e enviá-lo para o Cloudinary
                    const bufferStream = Readable.from(fileBuffer);
                    bufferStream.pipe(uploadStream);
                })

                bannerUrl = result.secure_url; // URL da imagem no Cloudinary
                console.log('Upload bem-sucedido. URL da imagem:', bannerUrl);

            } catch (error) {
                return { status: 'error', message: 'Falha ao fazer upload da imagem', statusCode: 500 };
            }
        } else {
            return { status: 'error', message: 'É necessário enviar uma imagem ou um link de imagem (banner_url)', statusCode: 400 };
        }

        // salvar a URL da imagem retornada pelo Cloudinary ou fornecida no campo 'banner' do produto

        const product = await prismaClient.product.create({
            data: {
                name,
                description,
                price: parseFloat(price.toString()), // Garantir que o preço seja um número decimal
                category_id,
                banner: bannerUrl,
            },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
                category_id: true,
                createdAt: true,
                updatedAt: true,
                disabled: true,
            }
        });

        return { status: 'success', data: product };
    }
}

export { CreateProductService };