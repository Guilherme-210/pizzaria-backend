import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@/configs/multer';
import { validateSchema } from '@/shareds/middlewares/validateSchemas';
import { productSchemas } from '@/schemas/product.schemas';
import { isAdmin } from '@/shareds/middlewares/isAdmin';
import { isAuthenticated } from '@/shareds/middlewares/isAuthenticated';
import { EditProductController } from '@/controllers/products/editProduct.controller';

const editProductRoutes = Router();
const upload = multer(uploadConfig);

const editProduct = new EditProductController().handle;
editProductRoutes.patch('/:id', isAuthenticated, isAdmin, upload.single('file'), validateSchema(productSchemas.edit), editProduct);

export { editProductRoutes };