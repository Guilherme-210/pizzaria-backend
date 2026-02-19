import { Readable } from "node:stream";
import cloudinary from "@/configs/cloudinary";

async function uploadAndGetUrl(fileBuffer: Buffer, fileName: string): Promise<string> {
    // Lógica para upload do arquivo para o Cloudinary
    let bannerUrl = '';

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
        throw new Error('Falha ao fazer upload da imagem');
    }

    return bannerUrl;
}

export { uploadAndGetUrl };