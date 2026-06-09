import { nanoid } from "nanoid";

/**
 * Validate whether a string is a valid URL
 * @param {string} url - URL string to validate
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Generate a unique short code (7 characters)
 * @returns {string} Short alphanumeric code
 */
export const generateShortCode = () => {
  return nanoid(7);
};

/**
 * Sanitize a custom alias: lowercase, strip special chars, limit length
 * @param {string} alias
 * @returns {string}
 */
export const sanitizeAlias = (alias) => {
  return alias
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 30);
};
