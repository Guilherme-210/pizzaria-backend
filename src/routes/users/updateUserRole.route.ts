import { Router } from 'express';
import { updateUserRoleController } from '@controllers/users/updateUserRole.controller';
import { userSchemas } from '@schemas/user.schemas';
import { validateSchema } from '@middlewares/validateSchemas';
import { isAuthenticated } from '@middlewares/isAuthenticated';
import { isAdmin } from '@middlewares/isAdmin';

const updateUserRoleRoutes = Router();

const updateUserRole = new updateUserRoleController().handle;
updateUserRoleRoutes.put(
  '/role',
  isAuthenticated,
  isAdmin,
  validateSchema(userSchemas.updateRole),
  updateUserRole
);

export { updateUserRoleRoutes };
