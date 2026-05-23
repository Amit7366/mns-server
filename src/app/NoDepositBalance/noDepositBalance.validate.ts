import { z } from "zod";

export const assignSchema = z.object({
    body: z.object({
        customerOfficerId: z.string().min(1, "customerOfficerId is required"),
    }),
});

export const assignBulkSchema = z.object({
    body: z.object({
        customerOfficerId: z.string().min(1),
        userIds: z.array(z.string().min(1)).min(1),
    }),
});


export const assignedQuerySchema = z.object({
    query: z.object({
        customerOfficerId: z.string().min(1, "customerOfficerId is required"),
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
    }),
});
