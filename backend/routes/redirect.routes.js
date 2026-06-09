import express from "express";
import { redirectUrl } from "../controllers/redirect.controller.js";

const router = express.Router();

// GET /:shortCode — redirect to original URL
// Exclude API and static routes
router.get("/:shortCode([a-zA-Z0-9_-]{3,30})", redirectUrl);

export default router;
