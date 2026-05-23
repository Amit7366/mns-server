import { z } from 'zod';

export const createGameValidation = z.object({
  body: z.object({
    game_code: z.string(),
    game_name: z.string(),
    game_type: z.string(),
    game_image: z.string().url(),
    platform: z.string(),
    provider: z.string(),
  }),
});

export const updateGameValidation = z.object({
  body: z.object({
    game_name: z.string().optional(),
    game_type: z.string().optional(),
    game_image: z.string().url().optional(),
    platform: z.string().optional(),
    provider: z.string().optional(),
  }),
});
