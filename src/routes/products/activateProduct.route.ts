import { Router } from "express";
import { ActivateProductController } from "@/controllers/products/activateProduct.controller";
import { isAdmin } from "@/shareds/middlewares/isAdmin";
import { isAuthenticated } from "@/shareds/middlewares/isAuthenticated";

const activateProductRoutes = Router();

const activateProduct = new ActivateProductController().handle;
activateProductRoutes.put('/activate/:id', isAuthenticated, isAdmin, activateProduct);

export { activateProductRoutes };