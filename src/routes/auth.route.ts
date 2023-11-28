import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import errorMiddleware from '../middlewares/error.middleware';

export function getRouter() {
  const router = Router();

  router.post('/register', authController.register, errorMiddleware);
  router.post('/login', authController.login, errorMiddleware);

  return router;
}