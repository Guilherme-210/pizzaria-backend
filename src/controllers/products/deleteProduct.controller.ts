import { Request, Response } from 'express';
import { DeleteProductService } from '@/services/products/deleteProduct.service';

class DeleteProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;

        const deleteService = new DeleteProductService();
        const result = await deleteService.execute({ id: id as string });

        if (result.status === 'error') {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json(result);
    }
}

export { DeleteProductController };