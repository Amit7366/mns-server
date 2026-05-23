import { Schema, model } from 'mongoose';

const gameSchema = new Schema(
    {
        game_name: { type: String, required: true },
        game_code: { type: String, required: true, unique: true },
        game_type: { type: String, required: true },
        game_image: { type: String, required: true },
        platform: { type: String, required: true },
        provider: { type: String, required: true },
    },
    { timestamps: true }
);
gameSchema.index({ game_code: 1 });
export const GameCatalogModel = model('GameCatalog', gameSchema);
