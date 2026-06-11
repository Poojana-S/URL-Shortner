import express from "express";
import { redirectUrl } from "../controllers/redirect.controller.js";

const router = express.Router();

// Handle short URL redirects like /abc123
router.get("/:shortCode", redirectUrl);

export default router;
