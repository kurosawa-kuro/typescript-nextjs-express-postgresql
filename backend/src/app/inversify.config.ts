// backend/src/app/inversify.config.ts
import { Container } from "inversify";
import { TYPES } from "./types/types";
import { IUsersService, IUsersController, IMicropostsService, IMicropostsController } from "./types/interfaces";
import { UsersService } from "./services/users.service";
import { UsersController } from "./controllers/users.controller";
import { MicropostsService } from "./services/microposts.service";
import { MicropostsController } from "./controllers/microposts.controller";

const container = new Container();

container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);
container.bind<IMicropostsService>(TYPES.MicropostsService).to(MicropostsService);
container.bind<IMicropostsController>(TYPES.MicropostsController).to(MicropostsController);

export { container };