import { IDevice } from './deviceInterfaces';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink?: string;
  cart: IDevice[];
}

export interface JwtPayload {
  id: string;
}
