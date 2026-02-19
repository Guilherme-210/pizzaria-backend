import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

export const validateSchema = (schema: ZodType) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        });
        
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                status: 'Error de validação',
                errors: error.issues.map(err => ({
                    campo: err.path.slice(1).join('.'),
                    mensagem: err.message.toString()
                }))
            });
            
            return;
        } 
        res.status(500).json({ status: 'Erro interno do servidor', message: 'Ocorreu um erro inesperado' });

        return;
    }
};