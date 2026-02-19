import { Request, Response } from 'express';
import { listCategoriesService } from '@services/category/listCategories.service';

class listCategoriesController {
    async handle(_req: Request, res: Response) {
        const listService = new listCategoriesService();
        const result = await listService.execute();

        if (result.status === 'error') {
            return res.status(500).json({ message: result.message });
        }

        return res.status(200).json(result);
    }
}

export { listCategoriesController };
