import Snack from "../models/snack.model.js"

export const listSnacks = async (userId) =>
  Snack.find({ userId }).sort({ lastDayConsumed: -1 }).lean()

export const createSnack = async (userId, payload) => {
  const snack = new Snack({ ...payload, userId })
  return snack.save()
}

export const updateSnackById = async (userId, id, payload) =>
  Snack.findOneAndUpdate({ _id: id, userId }, payload, { new: true }).lean()

export const deleteSnackById = async (userId, id) =>
  Snack.findOneAndDelete({ _id: id, userId })
