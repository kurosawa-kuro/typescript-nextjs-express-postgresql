// backend\src\app\routes\index.route.ts

import { Router } from "express";
import routerUsers from "./users.route";

const router = Router();

router.use("/users", routerUsers);

export default router;
