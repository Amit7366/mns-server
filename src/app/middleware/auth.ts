import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../utilis/catchAsync';
import AppError from '../errors/AppError';
import { TUserRole } from '../User/user.interface';
import mongoose from 'mongoose';
import { CustomJwtPayload } from '../Auth/CustomJwtPayload';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as CustomJwtPayload;

    if (!mongoose.Types.ObjectId.isValid(decoded.objectId)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid objectId in token');
    }

    if (requiredRoles.length && !requiredRoles.includes(decoded.role as TUserRole)) {
      throw new AppError(httpStatus.FORBIDDEN, 'Access Denied');
    }

    req.user = decoded;
    console.log('Authenticated user:', req.user);

    next();
  });
};

export default auth;
