import { Request, Response, NextFunction } from 'express';
import * as controllerUtils from '../utils/controllers.utils';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    controllerUtils.throwIfNotString(name, email, password);
    controllerUtils.throwIfNotEmail(email);

    const createUserData = await authService.register(name, email, password);

    res.status(201).json(createUserData);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    controllerUtils.throwIfNotString(email, password);
    controllerUtils.throwIfNotEmail(email);

    const loginData = await authService.login(email, password);

    res.status(200).json(loginData);
  } catch (error) {
    next(error);
  }
}

export function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    controllerUtils.throwIfNotString(refreshToken);

    const loginData = authService.refreshAuthToken(refreshToken);

    res.status(200).json(loginData);
  } catch (error) {
    next(error);
  }
}