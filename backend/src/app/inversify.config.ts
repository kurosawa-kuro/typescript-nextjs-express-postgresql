// backend/src/app/inversify.config.ts

import { Container } from "inversify";
import { TYPES } from "./types/types";
import { IUsersService, IUsersController } from "./types/interfaces";
import { UsersService } from "./services/users.service";
import { UsersController } from "./controllers/users.controller";

const container = new Container();

container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);

export { container };