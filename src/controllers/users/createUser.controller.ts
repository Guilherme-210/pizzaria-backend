import { Request, Response } from 'express';
import { createUserService } from '@services/user/createUser.service';

class createUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const service = new createUserService();

    const result = await service.execute({ name, email, password });

    if (result.status === 'error') {
      return res.status(result.statusCode || 500).json({ message: result.message });
    }

    return res.status(201).json(result);
  }
}

export { createUserController };
