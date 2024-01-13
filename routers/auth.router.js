import { Router } from "express";
const router = Router();

import {
  create,
  signIn,
  isAuth,
  logout,
} from "../controllers/auth.controller.js";

router.post("/create", create);
router.post("/sign-in", signIn);
router.post("/is-auth", isAuth);
router.post("/logout", logout);

export default router;
