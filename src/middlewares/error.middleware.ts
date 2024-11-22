import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/common/custom-error';

export const errorHandler = async (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  next();
};
