import Snack from "../models/snack.model.js"


export const createSnack = async (payload) => {
  const snack = new Snack(payload)
  return snack.save()
}


export const listSnacks = async () => Snack.find().lean()


export const deleteSnackById = async (id) =>
  Snack.findByIdAndDelete(id)


export const updateSnackById = async (id, payload) =>
  Snack.findByIdAndUpdate(id, payload, { new: true }).lean()