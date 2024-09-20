// src/app/inversify.config.ts

import { Container } from 'inversify';
import { TYPES } from './types/types';
import { IMicropostsService, IUsersService, IUsersController, IMicropostsController } from './types/interfaces';
import { MicropostsService } from './services/microposts.service';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { MicropostsController } from './controllers/microposts.controller';
import { PrismaClient } from '@prisma/client';

const container = new Container();


// サービスをバインド
container.bind<IMicropostsService>(TYPES.MicropostsService).to(MicropostsService);
container.bind<IUsersService>(TYPES.UsersService).to(UsersService);

// コントローラーをバインド
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);
container.bind<IMicropostsController>(TYPES.MicropostsController).to(MicropostsController);

export { container };
