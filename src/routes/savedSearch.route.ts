import { Router } from "express";
import * as savedSearchController from "../controllers/savedSearch.controller";
import { errorMiddleware } from "../middlewares/error.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

export function getRouter() {
    const router = Router();

    router.get("/savedSearches/:page", authMiddleware, savedSearchController.getSavedSearches, errorMiddleware);
    router.get("/reLaunchSavedSearch/:id", authMiddleware, savedSearchController.reLaunchSavedSearch, errorMiddleware);
    router.delete("/savedSearch/:id", authMiddleware, savedSearchController.deleteSavedSearch, errorMiddleware);

    return router;
}