import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { allProviderGames } from '../data/gameData';
import { GameCatalogModel } from '../models/GameCatalogModel';

dotenv.config();

// ✅ Normalize game_type field
const normalizeGameType = (type: string): string => {
  const lower = type.toLowerCase();
  if (lower.includes('slot')) return 'slot';
  if (lower.includes('fish')) return 'fishing';
  if (lower.includes('live') || lower.includes('casino')) return 'live';
  return 'all';
};

const seedGameCatalog = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log('✅ Connected to MongoDB');

    const gameDocs = allProviderGames.flatMap(({ platform, provider, games }) => {
      console.log(`→ ${provider}: ${games.length} games`);
      return games.map((game) => ({
        ...game,
        platform,
        provider,
        game_type: normalizeGameType(game.game_type), // ✅ Normalize game_type
      }));
    });

    let updatedCount = 0;

    for (const game of gameDocs) {
      const result = await GameCatalogModel.updateOne(
        { game_code: game.game_code },
        { $set: game },
        { upsert: true }
      );
      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        updatedCount++;
      }
    }

    console.log(`✅ Seeded or updated ${updatedCount} games into GameCatalog`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Game catalog seeding failed:', error);
    process.exit(1);
  }
};

seedGameCatalog();
