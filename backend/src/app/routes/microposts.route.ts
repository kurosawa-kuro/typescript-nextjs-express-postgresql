// src/app/routes/microposts.route.ts

import { Router } from "express";
import { container } from "@/app/inversify.config";
import { TYPES } from "@/app/types/types";
import { IMicropostsController } from "@/app/types/interfaces";
import validationMiddleware from "@/app/utils/validation.middleware";
import { micropostsSchemaCreate, micropostsSchemaGet } from "@/app/schemas/microposts.schema";

const router = Router();
const micropostsController = container.get<IMicropostsController>(TYPES.MicropostsController);

router.get("/", micropostsController.get.bind(micropostsController));
router.get(
  "/:id",
  [validationMiddleware(micropostsSchemaGet)],
  micropostsController.getOne.bind(micropostsController)
);
router.post(
  "/",
  [validationMiddleware(micropostsSchemaCreate)],
  micropostsController.createOne.bind(micropostsController)
);

export default router;