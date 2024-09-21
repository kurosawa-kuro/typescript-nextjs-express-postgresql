import { Router, Request, Response, NextFunction } from "express";
import { usersController } from "@/app/app";
import validationMiddleware from "@/app/utils/validation.middleware";
import { usersSchemaCreate, usersSchemaGet } from "@/app/schemas/users.schema";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => usersController.get(req, res, next));
router.get(
  "/:id",
  [validationMiddleware(usersSchemaGet)],
  (req: Request, res: Response, next: NextFunction) => usersController.getOne(req, res, next)
);
router.post(
  "/",
  [validationMiddleware(usersSchemaCreate)],
  (req: Request, res: Response, next: NextFunction) => usersController.createOne(req, res, next)
);

export default router;