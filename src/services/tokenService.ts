import jwt from 'jsonwebtoken';
import { tokenModel } from '../models/tokenModel';
import { IUserDTO } from 'types/interfaces/dtoInterfases';
import { JwtPayload } from '../types/interfaces/userInterfaces';

export const generateTokens = (payload: IUserDTO) => {
  let accessToken;
  let refreshToken;
  if (process.env.JWT_SECRET_KEY_ACCESS) {
    accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY_ACCESS,
      { expiresIn: '30m' }
    );
  }
  if (process.env.JWT_SECRET_KEY_REFRESH) {
    refreshToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY_REFRESH,
      { expiresIn: '60d' }
    );
  }

  return { accessToken, refreshToken };
};

export const saveToken = async (
  userId: string,
  refreshToken: string
) => {
  const tokenData = await tokenModel.findOne({
    user: userId,
  });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;

    return tokenData.save();
  }
  const token = await tokenModel.create({
    user: userId,
    refreshToken,
  });

  return token;
};

export const removeToken = async (
  refreshToken: string
) => {
  const tokenData = await tokenModel.deleteOne({
    refreshToken,
  });

  return tokenData;
};

export const validateAccessToken = (token: string) => {
  if (process.env.JWT_SECRET_KEY_ACCESS) {
    const userData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY_ACCESS
    ) as JwtPayload;

    return userData;
  }

  return null;
};

export const validateRefreshToken = (
  token: string
) => {
  if (process.env.JWT_SECRET_KEY_REFRESH) {
    const userData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY_REFRESH
    ) as JwtPayload;

    return userData;
  }

  return null;
};

export const findToken = async (
  refreshToken: string
) => {
  const tokenData = await tokenModel.findOne({
    refreshToken,
  });

  return tokenData;
};
