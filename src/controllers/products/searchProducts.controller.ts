import { Request, Response } from 'express';
import { SearchProductsService } from '@/services/products/searchProducts.service';

class SearchProductsController {
    async handle(req: Request, res: Response) {
        const { search } = req.query;

        if (!search || typeof search !== 'string') {
            return res.status(400).json({ message: 'Parâmetro de busca "search" é obrigatório' });
        }

        const searchService = new SearchProductsService();
        const result = await searchService.execute({ search: search.trim() });

        if (result.status === 'error') {
            return res.status(500).json({ message: result.message });
        }

        return res.status(200).json(result);
    }
}

export { SearchProductsController };
