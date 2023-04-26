import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Device } from '../models/deviceModel';
import APIFeatures from '../utils/apiFeatures';
import AppError from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const getAllDevices = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const features = new APIFeatures(
      Device.find(),
      req.query
    )
      .filter()
      .sort()
      .paginate();

    const devices = await features.query;

    res.status(200).json({
      status: 'success',
      results: devices.length,
      data: {
        devices,
      },
    });
  }
);

export const getDevice = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const device = await Device.findById(
      req.params.id
    );
    if (!device) {
      return next(
        new AppError(
          'No devices found with that ID!',
          404
        )
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        device,
      },
    });
  }
);

export const createDevice = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const newDevice = await Device.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { device: newDevice },
    });
  }
);

export const updateDevice = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!device) {
      return next(
        new AppError(
          'No device found with that ID!',
          404
        )
      );
    }
    res.status(200).json({
      status: 'success',
      data: { device },
    });
  }
);

export const deleteDevice = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const device = await Device.findByIdAndDelete(
      req.params.id
    );
    if (!device) {
      return next(
        new AppError(
          'No device found with that ID!',
          404
        )
      );
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
