// utils/jwt.ts (or wherever your JWT helpers are)

import jwt, { SignOptions } from 'jsonwebtoken';
import { CustomJwtPayload } from './CustomJwtPayload';


export const createToken = (
  jwtPayload: CustomJwtPayload,
  secret: string,
  expiresIn: string | number
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string): CustomJwtPayload => {
  return jwt.verify(token, secret) as CustomJwtPayload;
};
