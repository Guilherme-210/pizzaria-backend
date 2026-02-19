import { deleteCategoryService } from '@/services/category/deleteCategory.service';
import { Request, Response } from 'express';

class deleteCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.body;

        const deleteService = new deleteCategoryService();
        const result = await deleteService.execute({ id });

        if (result.status === 'error') {
            return res.status(result.statusCode || 500).json({ message: result.message });
        }

        return res.status(201).json(result);
    }
}

export { deleteCategoryController };