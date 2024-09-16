// backend/src/app/app.ts

import "reflect-metadata";
import express from "express";
import router from "@/app/routes/index.route";
import loggerMiddleware from "@/app/utils/logger";
import errorMiddleware from "@/app/utils/errorMiddleware";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(loggerMiddleware);
app.use(errorMiddleware);

export default app;