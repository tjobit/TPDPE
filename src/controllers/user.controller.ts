import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import * as userService from '../services/user.service';

export async function deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const connectedUser = req.user;

    const result = await userService.deleteUser(connectedUser.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}