import prismaClient from "@/prisma";
import { hash } from "bcryptjs";

interface ICreateUserService {
  name: string;
  email: string;
  password: string;
}

class createUserService {
  async execute({ name, email, password }: ICreateUserService) {
    try {
      const existingUser = await prismaClient.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return { status: 'error', message: 'Usuário já existe', statusCode: 400 };
      }

      const passwordHash = await hash(password, 8);

      const user = await prismaClient.user.create({
        data: {
          name,
          email,
          password: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return { status: 'success', data: user };
    } catch (error) {
      return { status: 'error', message: 'Falha ao criar usuário' };
    }
  }
}

export { createUserService };