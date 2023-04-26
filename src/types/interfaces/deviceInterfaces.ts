import {
  categoryDevices,
  currencyPrice,
} from 'constants/deviceConst';
import { Document } from 'mongoose';

export type priceType = {
  amount: number;
  currency: currencyPrice;
};

export interface IDevice extends Document {
  full_name: string;
  category: categoryDevices;
  isActive: boolean;
  image: string;
  description: string;
  micro_description: string;
  color_code: string;
  prices: priceType;
}
