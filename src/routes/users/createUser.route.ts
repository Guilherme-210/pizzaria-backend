import { Router } from 'express';
import { createUserController } from '@controllers/users/createUser.controller';
import { userSchemas } from '@schemas/user.schemas';
import { validateSchema } from '@middlewares/validateSchemas';

const createUserRoutes = Router();

const createUser = new createUserController().handle;
createUserRoutes.post('/', validateSchema(userSchemas.create), createUser);

export { createUserRoutes };