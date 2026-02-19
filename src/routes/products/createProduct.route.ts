import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@/configs/multer';
import { CreateProductController } from '@/controllers/products/createProduct.controller';
import { validateSchema } from '@/shareds/middlewares/validateSchemas';
import { productSchemas } from '@/schemas/product.schemas';
import { isAdmin } from '@/shareds/middlewares/isAdmin';
import { isAuthenticated } from '@/shareds/middlewares/isAuthenticated';

const createProductRoutes = Router();
const upload = multer(uploadConfig);

const createProduct = new CreateProductController().handle;
createProductRoutes.post('/', isAuthenticated, isAdmin, upload.single('file'), validateSchema(productSchemas.create), createProduct);

export { createProductRoutes };