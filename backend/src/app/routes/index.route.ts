// backend/src/app/routes/index.route.ts
import { Router } from "express";
import routerUsers from "./users.route";
import routerMicroposts from "./microposts.route";

const router = Router();

router.use("/users", routerUsers);
router.use("/microposts", routerMicroposts);

export default router;