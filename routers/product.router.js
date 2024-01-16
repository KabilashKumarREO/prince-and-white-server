import { Router } from "express";
const router = Router();

import {
  allProducts,
  getProduct,
  getCategoryProducts,
  addProduct,
} from "../controllers/product.controller.js";

router.get("/get-all", allProducts);
router.get("/get-product", getProduct);
router.get("/category-products", getCategoryProducts);
router.post("/add", addProduct);

export default router;
