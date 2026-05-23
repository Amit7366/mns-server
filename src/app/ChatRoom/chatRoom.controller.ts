import { Request, Response } from 'express';
import { ChatRoomService } from './chatRoom.service';
import { IChatRoom } from './chatRoom.interface';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';

export const getMyChatRooms = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = req.user;

  console.log(`User ID: ${user.objectId}`, user); // ✅ fixed string interpolation

  const result = await ChatRoomService.getUserChatRooms(user.objectId);

  sendResponse<IChatRoom[]>(res, {
    statusCode: 200,
    success: true,
    message: 'User chat rooms fetched successfully',
    data: result,
  });
});
