import { Request, Response } from "express"
import { DetailUserService } from "@/services/user/detailUser.service"

class DetailUserController {
    async handle(req: Request, res: Response) {
        try {
            const user_id = req.user_id;

            const detailUserService = new DetailUserService();
            const user = await detailUserService.execute(user_id!);

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.status(201).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao obter detalhes do usuário' });
        }
    }
}

export { DetailUserController };
