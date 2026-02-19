import prismaClient from '@/prisma';
import { Request, Response, NextFunction } from 'express'

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user_id = req.user_id;

    if (!user_id) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
    }

    const user = await prismaClient.user.findUnique({
        where: {
            id: user_id
        }
    });

    if (!user) {
        res.status(403).json({ error: 'Usuário não autenticado ou sem permissão de administrador' });
        return;
    }

    if (user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Usuário sem permissão de administrador' });
        return;
    }

    return next();
}
