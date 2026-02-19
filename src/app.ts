import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { routes } from "@routes/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use((error: Error, _: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({
      error: error.message
    });
  }

  return res.status(500).json({
    error: 'Internal server error'
  });
});

app.get('/api', (_: Request, res: Response) => {
  res.send('Pizzaria Backend is running!');
});

app.use('/api', routes);

export { app };
