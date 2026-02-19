import { Router } from 'express';
import { categorySchemas } from '@schemas/category.schemas';
import { validateSchema } from '@middlewares/validateSchemas';
import { createCategoryController } from '@/controllers/category/createCategory.controller';
import { isAuthenticated } from '@/shareds/middlewares/isAuthenticated';
import { isAdmin } from '@/shareds/middlewares/isAdmin';

const createCategoryRoutes = Router();

const createCategory = new createCategoryController().handle;
createCategoryRoutes.post('/', isAuthenticated, isAdmin, validateSchema(categorySchemas.create), createCategory);

export { createCategoryRoutes };