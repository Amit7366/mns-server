import { Schema, model, Document } from "mongoose";

export interface IGameTxn extends Document {
    serial_number: string;
    member_account: string;
    userId: string;
    game_uid?: string;
    game_round?: string;
    currency_code?: string;
    bet_amount: number;
    win_amount: number;
    net_amount: number;
    status: string;
    before_balance: number;
    after_balance: number;
    payload_json: any;
    createdAt: Date;
}

const txnSchema = new Schema<IGameTxn>(
    {
        serial_number: { type: String, required: true, unique: true },
        member_account: { type: String, required: true },
        userId: { type: String, required: true }, // match your UserBalance id
        game_uid: String,
        game_round: String,
        currency_code: String,
        bet_amount: Number,
        win_amount: Number,
        net_amount: Number,
        status: String,
        before_balance: Number,
        after_balance: Number,
        payload_json: Schema.Types.Mixed,
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

export const GameTxn = model<IGameTxn>("GameTxn", txnSchema);
