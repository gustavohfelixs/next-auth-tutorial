/**
 * An array of routes that are accesible to the public
 * These Routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/auth/reset",
  "/auth/reset/new-password",
];

/**
 * An array of routes that used for authentication
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/**
 * Thre prefix for API authentication routes
 * Routes that start with this prefix are user for API authentication purposes
 * @type {string[]}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
