import prismaClient from "@/prisma";

interface IUpdateUserRoleService {
  userId: string;
  role: string;
}

const VALID_ROLES = ['STAFF', 'ADMIN'];

class updateUserRoleService {
  async execute({ userId, role }: IUpdateUserRoleService) {
    try {
      // Validar se a role é válida
      if (!VALID_ROLES.includes(role)) {
        return {
          status: 'error',
          statusCode: 400,
          data: {
            error: `Role inválida. Roles aceitas: ${VALID_ROLES.join(', ')}`,
            acceptedRoles: VALID_ROLES
          }
        };
      }

      // Verificar se o usuário a ser modificado existe
      const userToUpdate = await prismaClient.user.findUnique({
        where: { id: userId }
      });

      if (!userToUpdate) {
        return {
          status: 'error',
          statusCode: 404,
          data: {
            error: 'Usuário não encontrado'
          }
        };
      }

      // Atualizar a role do usuário
      const updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: { role: role as 'STAFF' | 'ADMIN' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return {
        status: 'success',
        data: {
          message: 'Role do usuário atualizada com sucesso',
          user: updatedUser
        }
      };
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      return {
        status: 'error',
        statusCode: 500,
        data: {
          error: 'Falha ao atualizar role do usuário'
        }
      };
    }
  }
}

export { updateUserRoleService };
