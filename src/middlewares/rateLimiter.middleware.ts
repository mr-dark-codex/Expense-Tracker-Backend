import rateLimit from "express-rate-limit";

export const rootRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const rootRateLimit2 = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 2, // limit each IP to 1 request per 5 seconds
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "5 seconds",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
