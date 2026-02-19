import { Request, Response } from 'express';
import { updateUserRoleService } from '@services/user/updateUserRole.service';

class updateUserRoleController {
    async handle(req: Request, res: Response) {
        const { userId, role } = req.body;

        const service = new updateUserRoleService();
        const result = await service.execute({ userId, role });

        if (result.status === 'error') {
            return res.status(result.statusCode || 500).json(result.data || { error: 'Erro desconhecido' });
        }

        return res.status(200).json(result.data);
    }
}

export { updateUserRoleController };
