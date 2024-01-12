import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: [String],
  },
  { timestamps: true }
);

export default model("Product", ProductSchema);
