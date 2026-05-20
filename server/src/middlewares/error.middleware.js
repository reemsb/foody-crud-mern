import logger from "../utils/logger.js"

// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by 4-arg signature
export default function errorHandler(err, req, res, next) {
  logger.error(err)
  const status = err.status || err.statusCode || 500
  const message = err.message || "Internal Server Error"
  const payload = { status, message }
  if (req.app.get("env") === "development") payload.stack = err.stack
  res.status(status).json(payload)
}
