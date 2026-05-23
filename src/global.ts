// src/global.d.ts

import { CustomJwtPayload } from "./app/Auth/CustomJwtPayload";


declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

export {};
