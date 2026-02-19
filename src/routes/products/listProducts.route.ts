import { Router } from 'express';
import { ListProductsController } from '@/controllers/products/listProducts.controller';
import { validateSchema } from '@/shareds/middlewares/validateSchemas';
import { productSchemas } from '@/schemas/product.schemas';

const listProductRoutes = Router();

const listProducts = new ListProductsController().handle;
listProductRoutes.get('/', validateSchema(productSchemas.list), listProducts);

export { listProductRoutes };
