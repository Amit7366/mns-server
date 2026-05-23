import './global';
import { Request } from 'express';

const test = (req: Request) => {
  req.user?.email; // ✅ If your types are working, this should NOT give error
};
