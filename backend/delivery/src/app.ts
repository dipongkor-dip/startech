import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import deliveryRouter from './app/routes/delivery';
import env from './app/env';

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
app.use('/api/v1', deliveryRouter);

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Delivery service running' });
});

export default app;
