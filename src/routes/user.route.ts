import { Router } from "express";
import { errorMiddleware } from "../middlewares/error.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import * as userController from "../controllers/user.controller";

export function getRouter() {
    const router = Router();

    router.delete("/user", authMiddleware, userController.deleteUser, errorMiddleware);

    return router;
}