import asyncHandler from "../utils/asyncHandler.js"
import * as authService from "../services/auth.service.js"

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body
  const { user, token } = await authService.register({ email, password, name })
  res.status(201).json({ user, token })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const { user, token } = await authService.login({ email, password })
  res.json({ user, token })
})

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body
  const { user, token } = await authService.loginWithGoogle({ idToken })
  res.json({ user, token })
})

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user })
})
