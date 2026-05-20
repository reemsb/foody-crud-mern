import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import createHttpError from "http-errors"
import { OAuth2Client } from "google-auth-library"
import User from "../models/user.model.js"
import config from "../config/index.js"

const googleClient = config.auth.googleClientId
  ? new OAuth2Client(config.auth.googleClientId)
  : null

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiresIn,
  })

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const register = async ({ email, password, name }) => {
  if (!email || !password) throw createHttpError(400, "Email and password are required")
  if (!EMAIL_RE.test(email)) throw createHttpError(400, "Invalid email")
  if (password.length < 8) throw createHttpError(400, "Password must be at least 8 characters")

  const normalized = email.toLowerCase().trim()
  const existing = await User.findOne({ email: normalized })
  if (existing) throw createHttpError(409, "An account with this email already exists")

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    email: normalized,
    name: name?.trim() || normalized.split("@")[0],
    passwordHash,
  })

  return { user, token: signToken(user) }
}

export const login = async ({ email, password }) => {
  if (!email || !password) throw createHttpError(400, "Email and password are required")
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash")
  if (!user || !user.passwordHash) throw createHttpError(401, "Invalid email or password")

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw createHttpError(401, "Invalid email or password")

  return { user, token: signToken(user) }
}

export const loginWithGoogle = async ({ idToken }) => {
  if (!googleClient) throw createHttpError(503, "Google sign-in is not configured")
  if (!idToken) throw createHttpError(400, "Missing Google ID token")

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: config.auth.googleClientId,
  })
  const payload = ticket.getPayload()
  if (!payload?.email_verified) throw createHttpError(401, "Google email not verified")

  const email = payload.email.toLowerCase()
  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] })

  if (!user) {
    user = await User.create({
      email,
      googleId: payload.sub,
      name: payload.name || email.split("@")[0],
      avatarUrl: payload.picture,
    })
  } else if (!user.googleId) {
    user.googleId = payload.sub
    if (!user.avatarUrl && payload.picture) user.avatarUrl = payload.picture
    await user.save()
  }

  return { user, token: signToken(user) }
}

export const getUserById = async (id) => User.findById(id)
