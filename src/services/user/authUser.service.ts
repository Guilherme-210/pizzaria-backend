import prismaClient from "@/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface IAuthUserService {
  email: string;
  password: string;
}

class authUserService {
  async execute({ email, password }: IAuthUserService) {
    try {
      // Verificar se o usuário existe
      const user = await prismaClient.user.findUnique({ where: { email } });
      if (!user) {
        return { status: 'error', message: 'E-mail/Senha é obrigatórios', statusCode: 400 };
      }
      // Verificar se a senha está correta
      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) {
        return { status: 'error', message: 'E-mail/Senha é obrigatórios', statusCode: 400 };
      }

      // Gerar token JWT 
      const token = sign({ 
        name: user.name, 
        email: user.email,
        role: user.role
      }, process.env.JWT_SECRET! as string, {
        subject: user.id,
        expiresIn: '1d'
      });


      return { 
        status: 'logado',
         data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          web_token: token
         }
       };
    } catch (error) {
      return { status: 'error', message: 'Falha ao criar usuário' };
    }
  }
}

export { authUserService };