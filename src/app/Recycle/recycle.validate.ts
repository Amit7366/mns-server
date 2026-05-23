import { z } from "zod";

export const giveRecycleBonusSchema = z.object({
    body: z.object({
        userId: z.string().min(1, "userId is required"),
        amount: z.number().positive("amount must be > 0"),
    }),
});
