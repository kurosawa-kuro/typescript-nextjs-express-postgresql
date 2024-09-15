import { Router } from "express";
import routerUsers from "./users.route.js";

const router = Router();

router.use("/users", routerUsers);

export default router;
