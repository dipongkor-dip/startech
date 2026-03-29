import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import chatRouter from './app/routes/chat';
import env from './app/env/index';

const app: Application = express();

app.use(
  cors({
    credentials: true,
    origin: env.corsOrigin,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', chatRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Chat service running' });
});

export default app;
