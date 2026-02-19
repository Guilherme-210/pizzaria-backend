import { z } from 'zod'

class ProductSchemas {
    create = z.object({
        body: z.object({
            name: z.string({ message: 'Nome é obrigatório' })
                .min(3, { message: 'Nome deve conter pelo menos 3 caracteres' }),
            price: z.string({ message: 'Preço é obrigatório' })
                .min(1, { message: 'Preço deve conter pelo menos 1 caractere' })
                .regex(/^\d+(\.\d{1,2})?$/, { message: 'Preço deve ser um número válido, podendo conter até 2 casas decimais' }),
            description: z.string({ message: 'Descrição é obrigatória' })
                .min(10, { message: 'Descrição deve conter pelo menos 10 caracteres' }),
            category_id: z.string({ message: 'ID da categoria é obrigatório' }),
            banner_url: z.string({ message: 'Banner URL deve ser uma URL válida' })
                .url({ message: 'Banner URL deve ser uma URL válida' })
                .optional(),
        })
    });

    search = z.object({
        query: z.object({
            search: z.string({ message: 'Termo de busca é obrigatório' })
                .min(1, { message: 'Termo de busca deve conter pelo menos 1 caractere' }),
        })
    });

    edit = z.object({
        body: z.object({
            name: z.string({ message: 'Nome é obrigatório' })
                .min(3, { message: 'Nome deve conter pelo menos 3 caracteres' })
                .optional(),
            price: z.string({ message: 'Preço é obrigatório' })
                .min(1, { message: 'Preço deve conter pelo menos 1 caractere' })
                .regex(/^\d+(\.\d{1,2})?$/, { message: 'Preço deve ser um número válido, podendo conter até 2 casas decimais' })
                .optional(),
            description: z.string({ message: 'Descrição é obrigatória' })
                .min(10, { message: 'Descrição deve conter pelo menos 10 caracteres' })
                .optional(),
            category_id: z.string({ message: 'ID da categoria é obrigatório' })
                .optional(),
            banner_url: z.string({ message: 'Banner URL deve ser uma URL válida' })
                .url({ message: 'Banner URL deve ser uma URL válida' })
                .optional(),
        }),
        params: z.object({
            id: z.string({ message: 'ID do produto é obrigatório' }),
        })
    });

    list = z.object({
        query: z.object({
            disabled: z.enum(['true', 'false']).optional()
        })
    });

    getByCategory = z.object({
        query: z.object({
            category_id: z.string({ message: 'ID da categoria é obrigatório' })
                .min(1, { message: 'ID da categoria deve conter pelo menos 1 caractere' })
        })
    });
}

export const productSchemas = new ProductSchemas();