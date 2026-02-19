import { Router } from 'express';
import { GetProductsController } from '@/controllers/products/getProducts.controller';

const getProductRoutes = Router();

const getProduct = new GetProductsController().handle;
getProductRoutes.get('/:id', getProduct);

export { getProductRoutes };
