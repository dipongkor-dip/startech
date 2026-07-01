/**
 * Category API Configuration
 */
export const CATEGORY_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:5004/api/v1",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * Category Cache Configuration
 */
export const CATEGORY_CACHE_CONFIG = {
  DURATION: 5 * 60 * 1000, // 5 minutes
  KEY: "categories",
};

/**
 * Category-related constants
 */
export const CATEGORY_CONSTANTS = {
  ROOT_SLUG: "root",
  UNKNOWN_CATEGORY: "Unknown",
  DEFAULT_AUTO_NUMBER: 0,
};

/**
 * Error messages
 */
export const CATEGORY_ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch categories",
  TIMEOUT: "Request timeout: Categories fetch took too long",
  INVALID_FORMAT: "Invalid response format: expected array of categories",
  NETWORK_ERROR: "Network error occurred",
  UNKNOWN_ERROR: "Unknown error occurred while fetching categories",
};

/**
 * Loading states
 */
export const CATEGORY_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

/**
 * Redux thunk names
 */
export const REDUX_THUNK_NAMES = {
  FETCH_CATEGORIES: "categories/fetchCategories",
};
