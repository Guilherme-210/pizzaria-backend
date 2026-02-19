import { Request, Response } from 'express';
import { GetProductsByCategoryService } from '@/services/products/getProductsByCategory.service';

class GetProductsByCategoryController {
    async handle(req: Request, res: Response) {
        const { category_id } = req.query;

        const service = new GetProductsByCategoryService();
        const result = await service.execute({ category_id: category_id as string });

        if (result.status === 'error') {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json(result);
    }
}

export { GetProductsByCategoryController };
