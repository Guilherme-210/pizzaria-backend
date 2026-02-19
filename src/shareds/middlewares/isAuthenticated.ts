import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
    sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization

    if (!authToken) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [_, token] = authToken.split(' ');

    try {
        const { sub } = verify(token!, process.env.JWT_SECRET as string) as IPayload;

        req.user_id = sub;

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}
