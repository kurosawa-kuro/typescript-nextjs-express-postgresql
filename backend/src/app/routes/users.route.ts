// backend/src/app/routes/users.route.ts

import { Router } from "express";
import { container } from "@/app/inversify.config";
import { TYPES } from "@/app/types/types";
import { IUsersController } from "@/app/types/interfaces";
import validationMiddleware from "@/app/utils/validation.middleware";
import { usersSchemaCreate, usersSchemaGet } from "@/app/schemas/users.schema";

const router = Router();
const usersController = container.get<IUsersController>(TYPES.UsersController);

router.get("/", usersController.get.bind(usersController));
router.get(
  "/:id",
  [validationMiddleware(usersSchemaGet)],
  usersController.getOne.bind(usersController)
);
router.post(
  "/",
  [validationMiddleware(usersSchemaCreate)],
  usersController.createOne.bind(usersController)
);

export default router;
