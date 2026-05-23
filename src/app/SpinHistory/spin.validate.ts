import { z } from "zod";

export const claimSpinSchema = z.object({
  body: z.object({
    id: z.string().min(3), // sbmId like "sbm47641"
    spinWinAmount: z.number(),
  }),
});

export const statusSpinSchema = z.object({
  params: z.object({
    id: z.string().min(3),
  }),
});
