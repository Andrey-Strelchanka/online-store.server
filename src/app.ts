import * as dotenv from 'dotenv';
import { globalErrorHandler } from './services/errorService';
import AppError from './utils/appError';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import { deviceRouter } from './routes/deviceRoutes';
import { userRouter } from './routes/userRoutes';

dotenv.config();

export const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/devices', deviceRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);
