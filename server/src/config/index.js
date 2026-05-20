import dotenv from "dotenv"

dotenv.config()

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  logLevel: process.env.LOG_LEVEL || "info",
  trustProxy: process.env.TRUST_PROXY === "true",
  rateLimit: {
    points: parseInt(process.env.RATE_LIMIT_POINTS || "100", 10),
    duration: parseInt(process.env.RATE_LIMIT_DURATION || "60", 10),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "dev-only-change-me",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  },
  corsOrigin: process.env.CORS_ORIGIN || "*",
}

export default config
