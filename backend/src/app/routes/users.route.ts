import { Router } from "express";
import { UsersControllers } from "@/app/controllers/users.controller";
import validationMiddleware from "@/app/utils/validation.middleware";
import {
  usersSchemaCreate,
  usersSchemaGet,
} from "@/app/schemas/users.schema";

const router = Router();

router.get("/", UsersControllers.get);
router.get(
  "/:id",
  [validationMiddleware(usersSchemaGet)],
  UsersControllers.getOne,
);
router.post(
  "/",
  [validationMiddleware(usersSchemaCreate)],
  UsersControllers.createOne,
);

export default router;