import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { deviceModel } from '../models/deviceModel';
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
      deviceModel.find(),
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
    const device = await deviceModel.findById(
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

// export const createDevice = catchAsync(
//   async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const newDevice = await deviceModel.create(
//       req.body
//     );
//     res.status(201).json({
//       status: 'success',
//       data: { device: newDevice },
//     });
//   }
// );

// export const updateDevice = catchAsync(
//   async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const device = await deviceModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!device) {
//       return next(
//         new AppError(
//           'No device found with that ID!',
//           404
//         )
//       );
//     }
//     res.status(200).json({
//       status: 'success',
//       data: { device },
//     });
//   }
// );

// export const deleteDevice = catchAsync(
//   async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const device = await deviceModel.findByIdAndDelete(
//       req.params.id
//     );
//     if (!device) {
//       return next(
//         new AppError(
//           'No device found with that ID!',
//           404
//         )
//       );
//     }
//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   }
// );
