import { Router } from 'express';
import { categorySchemas } from '@schemas/category.schemas';
import { validateSchema } from '@middlewares/validateSchemas';
import { isAuthenticated } from '@/shareds/middlewares/isAuthenticated';
import { isAdmin } from '@/shareds/middlewares/isAdmin';
import { deleteCategoryController } from '@/controllers/category/deleteCategory.controller';

const deleteCategoryRoutes = Router();

const deleteCategory = new deleteCategoryController().handle;
deleteCategoryRoutes.delete('/', isAuthenticated, isAdmin, validateSchema(categorySchemas.delete), deleteCategory);

export { deleteCategoryRoutes };