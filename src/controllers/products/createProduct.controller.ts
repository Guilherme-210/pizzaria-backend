import { Request, Response } from "express";
import { CreateProductService } from "@/services/products/createProduct.service";

class CreateProductController {
    async handle(req: Request, res: Response) {
        const { name, description, price, category_id, banner_url } = req.body;
        const file = req.file;

        // Validar se há arquivo ou banner_url
        if (!file && !banner_url) {
            return res.status(400).json({ message: 'É necessário enviar uma imagem ou um link de imagem (banner_url)' });
        }

        const createProduct = new CreateProductService();
        const product = await createProduct.execute({
            name,
            description,
            price,
            category_id,
            fileBuffer: file?.buffer,
            fileName: file?.originalname,
            banner_url
        });

        if (product.status === 'error') {
            return res.status(product.statusCode || 500).json({ message: product.message });
        }

        return res.status(201).json(product);
    }
}

export { CreateProductController };