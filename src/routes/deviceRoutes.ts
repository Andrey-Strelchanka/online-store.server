import express from 'express';
import {
  // createDevice,
  // deleteDevice,
  getAllDevices,
  getDevice,
  // updateDevice,
} from '../controllers/deviceController';
import { authService } from '../services/authService';

export const deviceRouter = express.Router();

deviceRouter
  .route('/')
  .get(authService, getAllDevices);
// .post(createDevice);

deviceRouter.route('/:id').get(authService, getDevice);
// .patch(updateDevice)
// .delete(deleteDevice);
