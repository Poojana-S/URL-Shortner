/**
 * Format a date to a human-readable string
 */
export const formatDate = (date) => {
  if (!date) return "Never";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

/**
 * Format a date to relative time (e.g. "2 days ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return "Never";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diff = (new Date(date) - new Date()) / 1000;
  const absDiff = Math.abs(diff);

  if (absDiff < 60) return rtf.format(Math.round(diff), "second");
  if (absDiff < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (absDiff < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (absDiff < 2592000) return rtf.format(Math.round(diff / 86400), "day");
  if (absDiff < 31536000) return rtf.format(Math.round(diff / 2592000), "month");
  return rtf.format(Math.round(diff / 31536000), "year");
};

/**
 * Truncate a URL for display
 */
export const truncateUrl = (url, maxLength = 50) => {
  if (!url) return "";
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength) + "…";
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  }
};

/**
 * Extract error message from axios error
 */
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.message ||
    error?.message ||
    "Something went wrong."
  );
};

/**
 * Format large numbers (e.g. 1200 → "1.2K")
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
};
