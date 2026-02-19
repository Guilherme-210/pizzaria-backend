import { Request, Response } from 'express';
import { ActivateProductService } from '@/services/products/activateProduct.service';

class ActivateProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;

        const activateService = new ActivateProductService();
        const result = await activateService.execute({ id: id as string });

        if (result.status === 'error') {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json(result);
    }
}

export { ActivateProductController };