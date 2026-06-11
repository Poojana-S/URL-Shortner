import express from "express";
import {
  createUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  getDashboardAnalytics,
} from "../controllers/url.controller.js";
import protect from "../middleware/auth.middleware.js";
import {
  createUrlValidator,
  updateUrlValidator,
  validate,
} from "../middleware/validation.middleware.js";

const router = express.Router();

// All URL routes are protected
router.use(protect);

// GET  /urls/analytics/dashboard — must come BEFORE /:id
router.get("/analytics/dashboard", getDashboardAnalytics);

// GET  /urls
// POST /urls
router.route("/").get(getUserUrls).post(createUrlValidator, validate, createUrl);

// GET    /urls/:id
// PUT    /urls/:id
// DELETE /urls/:id
router
  .route("/:id")
  .get(getUrlById)
  .put(updateUrlValidator, validate, updateUrl)
  .delete(deleteUrl);

export default router;
