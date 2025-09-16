import * as service from "../services/snack.service.js"
import asyncHandler from "../utils/asyncHandler.js"
import createHttpError from "http-errors"


export const createSnack = asyncHandler(async (req, res) => {
  const result = await service.createSnack(req.body)
  res.status(201).json(result)
})


export const getSnacks = asyncHandler(async (req, res) => {
  const snacks = await service.listSnacks()
  res.json(snacks)
})


export const deleteSnack = asyncHandler(async (req, res) => {
  const deleted = await service.deleteSnackById(req.params.id)
  if (!deleted) throw createHttpError(404, "Snack not found")
  res.json({ name: deleted.name })
})


export const updateSnack = asyncHandler(async (req, res) => {
  const updated = await service.updateSnackById(req.params._id, req.body)
  if (!updated) throw createHttpError(404, "Snack not found")
  res.json(updated)
})