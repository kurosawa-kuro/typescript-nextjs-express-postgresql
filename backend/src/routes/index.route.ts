import { Router } from "express";
import routerUsers from "./users.route.js";
import { HomeController } from "../controllers/home.controller.js";

const router = Router();

router.get("/", HomeController.get);

router.use("/users", routerUsers);

export default router;
