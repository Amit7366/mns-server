import { CustomJwtPayload } from "../Auth/CustomJwtPayload";


declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
      // user: JwtPayload;
    }
  }
}
