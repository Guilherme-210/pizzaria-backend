import { Router } from "express";
import { DeleteProductController } from "@/controllers/products/deleteProduct.controller";
import { isAdmin } from "@/shareds/middlewares/isAdmin";
import { isAuthenticated } from "@/shareds/middlewares/isAuthenticated";

const deleteProductRoutes = Router();

const deleteProduct = new DeleteProductController().handle;
deleteProductRoutes.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

export { deleteProductRoutes };