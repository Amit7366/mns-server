import { z } from "zod";

// ✅ Only validate body because validateRequest() doesn't pass req.params
export const assignOfficerSchema = z.object({
  body: z.object({
    customerOfficerId: z.string().min(1, "customerOfficerId is required"),
  }),
});

export const assignOfficerBulkSchema = z.object({
  body: z.object({
    customerOfficerId: z.string().min(1, "customerOfficerId is required"),
    normalUserIds: z.array(z.string().min(1)).min(1, "normalUserIds required"),
  }),
});

export const assignedListQuerySchema = z.object({
  query: z.object({
    customerOfficerId: z.string().min(1, "customerOfficerId is required"),
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  }),
});
