import {
  categoryDevices,
  currencyPrice,
} from '../constants/deviceConst';
import mongoose, { Schema } from 'mongoose';
import { IDevice } from '../types/interfaces/deviceInterfaces';

const deviceSchema: Schema<IDevice> = new Schema({
  full_name: {
    type: String,
    required: [true, 'A device must have a name'],
    unique: true,
    trim: true,
    maxlength: [
      100,
      'The maximum length of device name - 100 chars',
    ],
    minlength: [
      10,
      'The minimum length of device name - 10 chars',
    ],
  },
  category: {
    type: String,
    required: [true, 'A device must have a category'],
    enum: {
      values: [
        categoryDevices.MOBILE,
        categoryDevices.SMART,
      ],
      message: `Category is either: ${categoryDevices.MOBILE} or: ${categoryDevices.SMART}`,
    },
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    required: [
      true,
      'A device must have a description',
    ],
  },
  micro_description: {
    type: String,
    required: [
      true,
      'A device must have a small description',
    ],
  },
  color_code: {
    type: String,
    required: [true, 'A device must have a color'],
  },
  prices: {
    _id: false,
    amount: {
      type: Number,
      required: [true, 'A device must have a price'],
    },
    currency: {
      type: String,
      default: currencyPrice.BYN,
    },
  },
});

export const deviceModel = mongoose.model(
  'Device',
  deviceSchema
);
