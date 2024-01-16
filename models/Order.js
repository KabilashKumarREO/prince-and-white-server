import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true },
    accountEmail: { type: String, required: true },
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    totalPrice: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    country: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    province: { type: String },
    zipcode: { type: String },
  },
  { timestamps: true }
);

export default model("Order", OrderSchema);
