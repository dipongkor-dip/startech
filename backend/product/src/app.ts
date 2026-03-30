import cors from "cors";
import express, {Application, Request, Response} from "express";
import {routes} from "./app/routes";
import env from "./app/env";


const app: Application = express();

// CORS configuration
app.use(
  cors({
    credentials: true,
    origin: env.corsOrigin,
  }),
);

// Parsers
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/api/v1", routes);

// Welcome route
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({message: "Product service running"});
});

export default app;
