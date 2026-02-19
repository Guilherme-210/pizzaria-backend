import { Router } from 'express';
import { authUserController } from '@controllers/users/authUser.controller';
import { userSchemas } from '@schemas/user.schemas';
import { validateSchema } from '@middlewares/validateSchemas';

const authUserRoutes = Router();

const authUser = new authUserController().handle;
authUserRoutes.post('/session', validateSchema(userSchemas.auth), authUser);

export { authUserRoutes };