import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { errorMiddleware } from "../middlewares/error.middleware";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../ressources/apiDocs.json";

export function getRouter() {
  const router = Router();

  router.post("/register", authController.register, errorMiddleware);
  router.post("/login", authController.login, errorMiddleware);
  router.post("/refreshToken", authController.refreshToken, errorMiddleware);

  router.use("/docs", swaggerUi.serve);
  router.get("/docs", swaggerUi.setup(swaggerDocument));

  return router;
}
