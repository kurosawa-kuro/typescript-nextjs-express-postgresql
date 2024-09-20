// backend/src/app/types/types.ts
const TYPES = {
  PrismaClient: Symbol.for('PrismaClient'),
  UsersService: Symbol.for("UsersService"),
  UsersController: Symbol.for("UsersController"),
  MicropostsService: Symbol.for("MicropostsService"),
  MicropostsController: Symbol.for("MicropostsController"),
};

export { TYPES };