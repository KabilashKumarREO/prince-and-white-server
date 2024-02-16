import { Router } from "express";
const router = Router();

import {
  addNewOrder,
  getOrder,
  getMyOrders,
} from "../controllers/order.controller.js";
import { mustAuth } from "../middleware/auth.js";

// routes
router.post("/add", addNewOrder);
router.get("/get-order", getOrder);
router.post("/my-orders", mustAuth, getMyOrders);

export default router;
