import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import {
  registerValidator,
  loginValidator,
  validate,
} from "../middleware/validation.middleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerValidator, validate, register);

// POST /api/auth/login
router.post("/login", loginValidator, validate, login);

// GET /api/auth/me  (protected)
router.get("/me", protect, getMe);

export default router;
