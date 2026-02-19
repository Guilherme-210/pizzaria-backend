import { Request, Response } from 'express';
import { editCategoryService } from '@services/category/editCategory.service';

class editCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.params as { id: string };
        const { name } = req.body;

        const editService = new editCategoryService();
        const result = await editService.execute({ id, name });

        if (result.status === 'error') {
            return res.status(result.statusCode || 500).json({ message: result.message });
        }

        return res.status(200).json(result);
    }
}

export { editCategoryController };