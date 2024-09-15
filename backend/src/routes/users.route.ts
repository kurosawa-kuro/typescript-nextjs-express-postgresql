import { Router } from "express";
import { UsersControllers } from "../controllers/users.controller.js";
import validationMiddleware from "../utils/validation.middleware.js";
import {
  usersSchemaCreate,
  usersSchemaGet,
  usersSchemaUpdate,
  usersSchemaDelete,
} from "../schemas/users.schema.js";

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/", UsersControllers.get);
router.get(
  "/:id",
  [validationMiddleware(usersSchemaGet)],
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UsersControllers.getOne,
);
router.post(
  "/",
  [validationMiddleware(usersSchemaCreate)],
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UsersControllers.createOne,
);
router.put(
  "/:id",
  [validationMiddleware(usersSchemaUpdate)],
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UsersControllers.updateOne,
);

router.delete(
  "/:id",
  [validationMiddleware(usersSchemaDelete)],
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UsersControllers.deleteOne,
);

export default router;
