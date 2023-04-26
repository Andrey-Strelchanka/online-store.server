import * as dotenv from 'dotenv';
import { globalErrorHandler } from './controllers/errorController';
import AppError from './utils/appError';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { deviceRouter } from './routes/deviceRoutes';

dotenv.config();

export const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

app.use('/api/devices', deviceRouter);
// app.use("/api/v1/users", userRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);
