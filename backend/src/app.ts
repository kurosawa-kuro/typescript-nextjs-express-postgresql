import express from "express";
import router from "./routes/index.route";
import loggerMiddleware from "./utils/logger";
import errorMiddleware from "./utils/errorMiddleware";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(loggerMiddleware);
app.use(errorMiddleware);

export default app;
