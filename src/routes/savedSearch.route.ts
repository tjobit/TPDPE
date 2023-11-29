import { Router } from "express";
import * as savedSearchController from "../controllers/savedSearch.controller";
import { errorMiddleware } from "../middlewares/error.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

export function getRouter() {
    const router = Router();

    router.get("/savedSearch/:page", authMiddleware, savedSearchController.getSavedSearch, errorMiddleware);

    return router;
}