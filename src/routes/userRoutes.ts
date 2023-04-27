import {
  activate,
  login,
  logout,
  refresh,
  registration,
} from '../controllers/userController';
import express from 'express';

export const userRouter = express.Router();

userRouter
  .post('/registration', registration)
  .post('/login', login)
  .post('/logout', logout)
  .get('/activate/:link', activate)
  .get('/refresh', refresh);
