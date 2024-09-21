import { Router, Request, Response, NextFunction } from "express";
import { micropostsController } from "@/app/app";
import validationMiddleware from "@/app/utils/validation.middleware";
import { micropostsSchemaCreate, micropostsSchemaGet } from "@/app/schemas/microposts.schema";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => micropostsController.get(req, res, next));
router.get(
  "/:id",
  [validationMiddleware(micropostsSchemaGet)],
  (req: Request, res: Response, next: NextFunction) => micropostsController.getOne(req, res, next)
);
router.post(
  "/",
  [validationMiddleware(micropostsSchemaCreate)],
  (req: Request, res: Response, next: NextFunction) => micropostsController.createOne(req, res, next)
);

export default router;