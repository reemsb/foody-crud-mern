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
    duration: parseInt(process.env.RATE_LIMIT_DURATION || "60", 10)
  }
}

export default config