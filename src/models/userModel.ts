import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/interfaces/userInterfaces';
import validator from 'validator';

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, 'Please, tell us your name'],
  },
  email: {
    type: String,
    require: [true, 'Please, provide your email'],
    unique: true,
    validate: [
      validator.isEmail,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    require: [true, 'Please, provide your password'],
    minlength: 8,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  activationLink: {
    type: String,
  },
  cart: [
    {
      type: Schema.Types.ObjectId,
      default: [],
      ref: 'Device',
    },
  ],
});

export const userModel = mongoose.model(
  'User',
  userSchema
);
