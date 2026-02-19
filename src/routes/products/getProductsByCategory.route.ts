import { Router } from 'express';
import { GetProductsByCategoryController } from '@/controllers/products/getProductsByCategory.controller';
import { validateSchema } from '@/shareds/middlewares/validateSchemas';
import { productSchemas } from '@/schemas/product.schemas';

const getProductsByCategoryRoutes = Router();

const getProductsByCategory = new GetProductsByCategoryController().handle;
getProductsByCategoryRoutes.get('/', validateSchema(productSchemas.getByCategory), getProductsByCategory);

export { getProductsByCategoryRoutes };
