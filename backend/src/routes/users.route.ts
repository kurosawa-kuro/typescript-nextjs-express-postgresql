import { Router } from "express";
import { UsersControllers } from "../controllers/users.controller";
import validationMiddleware from "../utils/validation.middleware";
import {
  usersSchemaCreate,
  usersSchemaGet,
} from "../schemas/users.schema";

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

export default router;
