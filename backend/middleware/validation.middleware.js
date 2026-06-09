import { body, validationResult } from "express-validator";

/**
 * Run validation checks and return errors if any
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Auth Validators ───────────────────────────────────────────────────────────
export const registerValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

// ─── URL Validators ────────────────────────────────────────────────────────────
export const createUrlValidator = [
  body("originalUrl")
    .trim()
    .notEmpty().withMessage("Original URL is required")
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Please provide a valid URL (must start with http:// or https://)"),

  body("customAlias")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage("Custom alias must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage("Alias can only contain letters, numbers, hyphens, and underscores"),

  body("title")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
];

export const updateUrlValidator = [
  body("title")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  body("originalUrl")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Please provide a valid URL (must start with http:// or https://)"),
];
