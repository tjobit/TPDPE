import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(error.status).json(error.message);
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;