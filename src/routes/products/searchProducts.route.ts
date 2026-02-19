import { Router } from 'express';
import { SearchProductsController } from '@/controllers/products/searchProducts.controller';
import { validateSchema } from '@/shareds/middlewares/validateSchemas';
import { productSchemas } from '@/schemas/product.schemas';

const searchProductsRoutes = Router();

const searchProducts = new SearchProductsController().handle;
searchProductsRoutes.get('/search', validateSchema(productSchemas.search), searchProducts);

export { searchProductsRoutes };