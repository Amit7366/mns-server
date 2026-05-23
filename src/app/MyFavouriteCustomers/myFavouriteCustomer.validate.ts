import { z } from "zod";

export const createFavouriteCustomerSchema = z.object({
    body: z.object({
        userName: z.string().min(1, "userName is required"),
        contactNo: z.string().min(1, "contactNo is required"),
        sbmId: z.string().min(1, "sbmId is required"),
        adminId: z.string().min(1, "adminId is required"), // ✅ A-0001
    }),
});

export const getFavouriteCustomerByAdminSchema = z.object({
    query: z.object({
        adminId: z.string().min(1, "adminId is required"), // ✅ A-0001
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});
