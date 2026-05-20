import express from "express"
import helmet from "helmet"
import compression from "compression"
import cors from "cors"
import mongoose from "mongoose"
import { RateLimiterMemory } from "rate-limiter-flexible"

import config from "./config/index.js"
import logger from "./utils/logger.js"
import errorHandler from "./middlewares/error.middleware.js"
import notFound from "./middlewares/notfound.middleware.js"
import snackRoutes from "./routes/snack.routes.js"
import authRoutes from "./routes/auth.routes.js"

const app = express()

app.set("trust proxy", config.trustProxy)
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  cors({
    origin:
      config.corsOrigin === "*"
        ? true
        : config.corsOrigin.split(",").map((o) => o.trim()),
    credentials: true,
  }),
)

const limiter = new RateLimiterMemory({
  points: config.rateLimit.points,
  duration: config.rateLimit.duration,
})

app.use((req, res, next) => {
  limiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).json({ message: "Too Many Requests" }))
})

app.get("/healthz", (req, res) => res.json({ ok: true }))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/snacks", snackRoutes)
app.use(notFound)
app.use(errorHandler)

let server

async function start() {
  try {
    if (!config.mongoUri) throw new Error("MONGO_URI not set")
    await mongoose.connect(config.mongoUri)
    logger.info("Connected to MongoDB")
    server = app.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port}`)
    })
  } catch (err) {
    logger.error("Failed to start", err)
    process.exit(1)
  }
}

start()

const shutdown = async () => {
  logger.info("Received shutdown signal, closing server...")
  if (server) await new Promise((resolve) => server.close(resolve))
  await mongoose.disconnect()
  logger.info("Shutdown complete")
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
