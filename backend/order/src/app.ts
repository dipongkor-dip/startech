import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import orderRouter from './app/routes/order';
import env from './app/env/index';

const app: Application = express();

// CORS configuration
app.use(
  cors({
    credentials: true,
    origin: env.corsOrigin,
  })
);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', orderRouter);

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Order service running' });
});

export default app;
