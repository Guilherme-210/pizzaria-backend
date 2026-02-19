import { Request, Response } from 'express';
import { GetProductService } from '@/services/products/getProduct.service';

class GetProductsController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;

        const getService = new GetProductService();
        const result = await getService.execute({ id: id as string });

        if (result.status === 'error') {
            return res.status(404).json({ message: result.message });
        }

        if (!result.data) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        return res.status(200).json(result);
    }
}

export { GetProductsController };
