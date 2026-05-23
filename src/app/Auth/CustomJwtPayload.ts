// src/interfaces/customJwtPayload.ts
import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
  email: string;
  objectId: string;
  contactNo: string;
  userName: string;
}
