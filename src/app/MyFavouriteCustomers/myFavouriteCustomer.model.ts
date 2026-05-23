import { Schema, model } from "mongoose";
import { TMyFavouriteCustomer } from "./myFavouriteCustomer.interface";

const MyFavouriteCustomerSchema = new Schema<TMyFavouriteCustomer>(
  {
    userName: { type: String, required: true, trim: true },
    contactNo: { type: String, required: true, trim: true },
    sbmId: { type: String, required: true, trim: true },
    adminId: { type: String, required: true, trim: true }, // ✅ string like A-0001
  },
  {
    timestamps: true,
    collection: "myFavouriteCustomers",
  }
);

// ✅ fast filter by adminId
MyFavouriteCustomerSchema.index({ adminId: 1, createdAt: -1 });

// ✅ avoid duplicate favourites for same admin + same customer
MyFavouriteCustomerSchema.index({ adminId: 1, sbmId: 1 }, { unique: true });

export const MyFavouriteCustomer = model<TMyFavouriteCustomer>(
  "MyFavouriteCustomer",
  MyFavouriteCustomerSchema
);
