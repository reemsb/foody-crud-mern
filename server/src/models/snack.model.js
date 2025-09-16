import { Schema, model } from 'mongoose'

//define the schema.
const snackSchema= new Schema({
  name: {
    type: String,
    required: true
  },
  lastDayConsumed: Date,
  isFavorite: Boolean,
  calories: {
    value: { type: Number },
    unit: { type: String }
  }
  }, {
  versionKey: false,
  timestamps: true
  })
const Snack = model("Snack", snackSchema)

export default Snack