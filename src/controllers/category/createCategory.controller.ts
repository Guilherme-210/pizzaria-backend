import { Request, Response } from 'express';
import { createCategoryService } from '@services/category/createCategory.service';

class createCategoryController {
    async handle(req: Request, res: Response) {
        const { name } = req.body;

        const createService = new createCategoryService();
        const result = await createService.execute({ name });

        if (result.status === 'error') {
            return res.status(result.statusCode || 500).json({ message: result.message });
        }

        return res.status(201).json(result);
    }
}

export { createCategoryController };