import multer from "multer";

// Configuração do multer para armazenamento em memória (para upload direto para o Cloudinary)
export default {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB por arquivo
    },
    fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido. Apenas JPEG, JPG, PNG e GIF são aceitos.'));
        }
    }
}