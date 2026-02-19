import { Router } from 'express';
import { editCategoryController } from '@/controllers/category/editCategory.controller';
import { isAuthenticated } from '@/shareds/middlewares/isAuthenticated';
import { isAdmin } from '@/shareds/middlewares/isAdmin';

const editCategoryRoutes = Router();

const editCategory = new editCategoryController().handle;
editCategoryRoutes.put('/:id', isAuthenticated, isAdmin, editCategory);

export { editCategoryRoutes };