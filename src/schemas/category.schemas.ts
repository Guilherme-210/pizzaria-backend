import { z } from 'zod'

class CategorySchemas {
    create = z.object({
        body: z.object({
            name: z.string({ message: 'Nome é obrigatório' }).min(3, { message: 'Nome deve conter pelo menos 3 caracteres' }),
        })
    });

    delete = z.object({
        body: z.object({
            id: z.string({ message: 'ID é obrigatório' }).min(1, { message: 'ID deve conter pelo menos 1 caractere' }),
        })
    });
}

export const categorySchemas = new CategorySchemas();