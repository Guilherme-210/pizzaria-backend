import { Request, Response } from 'express';
import { authUserService } from '@services/user/authUser.service';


class authUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const authService = new authUserService();
    const result = await authService.execute({ email, password });

    if (result.status === 'error') {
      return res.status(result.statusCode || 500).json({ message: result.message });
    }

    return res.status(201).json(result);
  }
}

export { authUserController };
