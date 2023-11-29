import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.status(error.status).json(error.message);
  } catch (error) {
    next(error);
  }
}
