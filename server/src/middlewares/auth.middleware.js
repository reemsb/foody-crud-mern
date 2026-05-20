import jwt from "jsonwebtoken"
import createHttpError from "http-errors"
import config from "../config/index.js"
import { getUserById } from "../services/auth.service.js"

export default async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ""
    const [scheme, token] = header.split(" ")
    if (scheme !== "Bearer" || !token) {
      throw createHttpError(401, "Missing or invalid Authorization header")
    }

    const payload = jwt.verify(token, config.auth.jwtSecret)
    const user = await getUserById(payload.sub)
    if (!user) throw createHttpError(401, "User no longer exists")

    req.user = user
    next()
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(createHttpError(401, "Invalid or expired token"))
    }
    next(err)
  }
}
