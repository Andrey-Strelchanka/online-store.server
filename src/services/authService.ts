import AppError from '../utils/appError';
import { validateAccessToken } from '../services/tokenService';
import { NextFunction, Response } from 'express';

export const authService = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError(`Unauthorization.`, 401));
  }
  const accessToket = authHeader.split(' ')[1];
  if (!accessToket) {
    return next(new AppError(`Unauthorization.`, 401));
  }

  const userData = validateAccessToken(accessToket);
  req.user = userData;
  next();
  if (!userData) {
    return next(new AppError(`Unauthorization.`, 401));
  }
};
