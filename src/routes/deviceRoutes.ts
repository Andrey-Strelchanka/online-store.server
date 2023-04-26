import express from 'express';
import {
  createDevice,
  deleteDevice,
  getAllDevices,
  getDevice,
  updateDevice,
} from '../controllers/deviceController';

export const deviceRouter = express.Router();

deviceRouter
  .route('/')
  .get(getAllDevices)
  .post(createDevice);

deviceRouter
  .route('/:id')
  .get(getDevice)
  .patch(updateDevice)
  .delete(deleteDevice);
