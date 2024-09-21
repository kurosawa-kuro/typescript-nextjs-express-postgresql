import express from "express";
import router from "@/app/routes/index.route";
import loggerMiddleware from "@/app/utils/logger";
import errorMiddleware from "@/app/utils/errorMiddleware";
import helmet from "helmet";
import { UsersController } from "./controllers/users.controller";
import { MicropostsController } from "./controllers/microposts.controller";
import { UsersService } from "./services/users.service";
import { MicropostsService } from "./services/microposts.service";
import { query } from "./config/dbClient";

const app = express();

// サービスのインスタンス化
const usersService = new UsersService(query);
const micropostsService = new MicropostsService(query);

// コントローラーのインスタンス化
const usersController = new UsersController(usersService);
const micropostsController = new MicropostsController(micropostsService);

// グローバルミドルウェアの設定
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーターの設定
app.use(router);

// エラーハンドリングミドルウェアの設定
app.use(loggerMiddleware);
app.use(errorMiddleware);

export { app, usersController, micropostsController };