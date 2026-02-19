import { Router } from 'express';

import { createUserRoutes } from './users/createUser.route';
import { authUserRoutes } from './users/authUser.route';
import { detailUserRoutes } from './users/detailUser.route';
import { updateUserRoleRoutes } from './users/updateUserRole.route';

import { createCategoryRoutes } from './category/createCategory.route';
import { deleteCategoryRoutes } from './category/deleteCategory.route';
import { listCategoriesRoutes } from './category/listCategories.route';
import { editCategoryRoutes } from './category/editCategory.route';

import { createProductRoutes } from './products/createProduct.route';
import { listProductRoutes } from './products/listProducts.route';
import { getProductRoutes } from './products/getProducts.route';
import { editProductRoutes } from './products/editProduct.route';
import { deleteProductRoutes } from './products/deleteProduct.route';
import { activateProductRoutes } from './products/activateProduct.route';
import { disableProductRoutes } from './products/disableProduct.route';
import { searchProductsRoutes } from './products/searchProducts.route';
import { getProductsByCategoryRoutes } from './products/getProductsByCategory.route';

const routes = Router();

routes.get('/', (_req, res) => {
    res.json({ message: 'Hello World!' });
});

// Users
routes.use('/user', detailUserRoutes)
routes.use('/user', createUserRoutes, authUserRoutes, updateUserRoleRoutes)

// Categories
routes.use('/category', listCategoriesRoutes);
routes.use('/category/product', getProductsByCategoryRoutes);
routes.use('/category', createCategoryRoutes, deleteCategoryRoutes, editCategoryRoutes);

// Products
routes.use('/products', listProductRoutes);
routes.use('/products', searchProductsRoutes);
routes.use('/products', getProductRoutes);
routes.use('/products', createProductRoutes, editProductRoutes, deleteProductRoutes, activateProductRoutes, disableProductRoutes);

export { routes };