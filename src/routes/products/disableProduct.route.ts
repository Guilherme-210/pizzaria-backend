import { Router } from "express";
import { DisableProductController } from "@/controllers/products/disableProduct.controller";
import { isAdmin } from "@/shareds/middlewares/isAdmin";
import { isAuthenticated } from "@/shareds/middlewares/isAuthenticated";

const disableProductRoutes = Router();

const disableProduct = new DisableProductController().handle;
disableProductRoutes.put('/disable/:id', isAuthenticated, isAdmin, disableProduct);

export { disableProductRoutes };