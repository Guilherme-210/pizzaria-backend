import { Router } from 'express';
import { listCategoriesController } from '@/controllers/category/listCategories.controller';
import { isAuthenticated } from '@/shareds/middlewares/isAuthenticated';

const listCategoriesRoutes = Router();

const listCategories = new listCategoriesController().handle;
listCategoriesRoutes.get('/', isAuthenticated, listCategories);

export { listCategoriesRoutes };
