import { Request, Response } from "express";
import { EditProductService } from "@/services/products/editProduct.service";

class EditProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { name, description, price, category_id, disabled, banner_url } = req.body;
        const file = req.file;

        if (!id) {
            return res.status(400).json({ message: 'ID do produto é obrigatório' });
        }

        const editProduct = new EditProductService();
        const result = await editProduct.execute({
            id: id as string,
            name,
            description,
            price,
            category_id,
            disabled,
            fileBuffer: file?.buffer,
            fileName: file?.originalname,
            banner_url
        });

        if (result.status === 'error') {
            return res.status(result.statusCode || 500).json({ message: result.message });
        }

        return res.status(200).json(result);
    }
}

export { EditProductController };