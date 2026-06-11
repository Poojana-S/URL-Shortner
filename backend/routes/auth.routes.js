import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import {
  registerValidator,
  loginValidator,
  validate,
} from "../middleware/validation.middleware.js";

const router = express.Router();

// POST /register
router.post("/register", registerValidator, validate, register);

// POST /login
router.post("/login", loginValidator, validate, login);

// GET /me  (protected)
router.get("/me", protect, getMe);

export default router;
