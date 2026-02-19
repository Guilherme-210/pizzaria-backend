import { Request, Response } from 'express';
import { DisableProductService } from '@/services/products/disableProduct.service';

class DisableProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;

        const disableService = new DisableProductService();
        const result = await disableService.execute({ id: id as string });

        if (result.status === 'error') {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json(result);
    }
}

export { DisableProductController };