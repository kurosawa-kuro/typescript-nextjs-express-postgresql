// backend/src/app/types/types.ts
const TYPES = {
  UsersService: Symbol.for("UsersService"),
  UsersController: Symbol.for("UsersController"),
  MicropostsService: Symbol.for("MicropostsService"),
  MicropostsController: Symbol.for("MicropostsController"),
};

export { TYPES };