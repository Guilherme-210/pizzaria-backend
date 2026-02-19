import { Router } from 'express';
import { DetailUserController } from '@controllers/users/detailUser.controller';
import { isAuthenticated } from '@/shareds/middlewares/isAuthenticated';

const detailUserRoutes = Router();

const detailUser = new DetailUserController().handle;
detailUserRoutes.get('/me', isAuthenticated, detailUser);

export { detailUserRoutes };