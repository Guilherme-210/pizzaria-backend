import { Request, Response } from 'express';
import { ListProductsService } from '@/services/products/listProducts.service';

class ListProductsController {
    async handle(req: Request, res: Response) {
        const { disabled } = req.query;

        const listService = new ListProductsService();
        const result = await listService.execute({ disabled: disabled as string });

        if (result.status === 'error') {
            return res.status(500).json({ message: result.message });
        }

        return res.status(200).json(result);
    }
}

export { ListProductsController };
