import {
  NextFunction,
  Request,
  Response,
} from 'express';
import AppError from '../utils/appError';

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const message = `Duplicate field value: ${Object.values(
    err.keyValue
  ).join(' ,')}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors)
    .map((el: any) => el.message)
    .join('. ');
  const message = `Invalid input data. ${errors}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR!', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = err;
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    sendErrorProd(error, res);
  }
};
