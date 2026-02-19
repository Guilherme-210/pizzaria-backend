import { z } from 'zod'

class UserSchemas {
    create = z.object({
        body: z.object({
            name: z.string({ message: 'Nome é obrigatório' }).min(3, { message: 'Nome deve conter pelo menos 3 caracteres' }),
            email: z.email({ message: 'Precisa ser um email válido' }),
            password: z.string({ message: 'Senha é obrigatória' }).min(6, { message: 'Senha deve conter pelo menos 6 caracteres' })
        })
    });

    auth = z.object({
        body: z.object({
            email: z.email({ message: 'Precisa ser um email válido' }),
            password: z.string({ message: 'Senha é obrigatória' })
        })
    });
}

export const userSchemas = new UserSchemas();