import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { userModel } from '../models/userModel';
import AppError from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { sendActivationMail } from '../services/emailService';
import {
  findToken,
  generateTokens,
  removeToken,
  saveToken,
  validateRefreshToken,
} from '../services/tokenService';
import { UserDto } from '../dtos/UserDto';

export const registration = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password } = req.body;
    const candidate = await userModel.findOne({
      email,
    });
    if (candidate) {
      return next(
        new AppError(
          `A user with that email already exists`,
          400
        )
      );
    }
    const hashedPassword = await bcrypt.hash(
      password,
      3
    );
    const activationLink = v4();
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      activationLink,
    });
    await sendActivationMail(
      email,
      `${process.env.API_URL}/api/users/activate/${activationLink}`
    );
    const userDto = new UserDto(user);
    const tokens = generateTokens({ ...userDto });
    await saveToken(
      userDto.id,
      tokens.refreshToken as string
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 60 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      //   secure: true,
    });
    res.status(200).json({
      status: 'success',
      token: tokens.accessToken,
      data: {
        user: userDto,
      },
    });
  }
);

export const login = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return next(
        new AppError(`Such a user does not exist`, 400)
      );
    }

    const isPassEquals = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPassEquals) {
      return next(
        new AppError(`Invalid password`, 400)
      );
    }

    if (user.isActivated === false) {
      return next(
        new AppError(
          `Activate your account. You got an email.`,
          400
        )
      );
    }

    const userDto = new UserDto(user);
    const tokens = generateTokens({ ...userDto });
    await saveToken(
      userDto.id,
      tokens.refreshToken as string
    );

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 60 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      //   secure: true,
    });
    res.status(200).json({
      status: 'success',
      token: tokens.accessToken,
      data: {
        user: userDto,
      },
    });
  }
);

export const logout = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { refreshToken } = req.cookies;
    const token = await removeToken(refreshToken);
    res.clearCookie('refreshToken');

    return res.status(204).json({
      status: 'success',
      token,
      data: null,
    });
  }
);

export const activate = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { link } = req.params;
    const user = await userModel.findOne({
      activationLink: link,
    });
    if (!user) {
      return next(
        new AppError(`Such a user does not exist`, 404)
      );
    }

    user.isActivated = true;
    await user.save();
    if (process.env.CLIENT_URL) {
      return res.redirect(process.env.CLIENT_URL);
    }
  }
);

export const refresh = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(new AppError(`Log in again`, 401));
    }
    const userData =
      validateRefreshToken(refreshToken);
    const tokenFromDB = await findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      return next(new AppError(`Log in again`, 401));
    }

    const user = await userModel.findById(userData.id);

    const userDto = new UserDto(user);
    const tokens = generateTokens({ ...userDto });
    await saveToken(
      userDto.id,
      tokens.refreshToken as string
    );

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 60 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      //   secure: true,
    });
    res.status(200).json({
      status: 'success',
      token: tokens.accessToken,
      data: {
        user: userDto,
      },
    });
  }
);
