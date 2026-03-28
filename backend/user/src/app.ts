import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { env } from './app/env';
import './app/config/passport';
import router from './app/routes';

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
app.use(cookieParser());

// Passport
app.use(passport.initialize());

// Routes
app.use('/api/v1/auth', router);

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'User service running' });
});

export default app;
