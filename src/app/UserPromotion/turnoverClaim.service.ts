// src/UserPromotion/turnoverClaim.service.ts

import { TurnoverTracking } from './turnoverTracking.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { BetTransaction } from '../Transaction/betTransaction.model';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export const claimCompletedTurnoverBonus = async (userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const turnover = await TurnoverTracking.findOne({
            userId,
            isCompleted: true,
            isClaimed: false,
            bonusAmount: { $gt: 0 },
        }).sort({ createdAt: 1 }).session(session);

        if (!turnover) throw new Error('No claimable turnover bonus found');

        // const userBalance = await UserBalance.findOne({ userId }).session(session);
        // if (!userBalance) throw new Error('User balance not found');

        // // Credit bonus to balance
        // userBalance.currentBalance += turnover.bonusAmount!;
        // await userBalance.save({ session });

        // Mark turnover entry as claimed
        turnover.isClaimed = true;
        await turnover.save({ session });

        // Log transaction for the claimed bonus
        // await BetTransaction.create([{
        //     userId,
        //     id: userBalance.id,
        //     amount: turnover.bonusAmount,
        //     type: 'refund',
        //     status: 'completed',
        //     metadata: {
        //         gameId: 'bonus-claim',
        //         game_type: 'all',
        //         roundId: uuidv4(),
        //         serialNumber: uuidv4(),
        //         currencyCode: 'TK',
        //         betAmount: 0,
        //         callbackTimestamp: Date.now(),
        //     },
        // }], { session });

        await session.commitTransaction();
        return { message: 'Bonus claimed successfully', amount: turnover.bonusAmount };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
