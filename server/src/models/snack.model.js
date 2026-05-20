import { Schema, model } from "mongoose"

const snackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    lastDayConsumed: Date,
    isFavorite: Boolean,
    calories: {
      value: { type: Number },
      unit: { type: String },
    },
  },
  { versionKey: false, timestamps: true },
)

export default model("Snack", snackSchema)
