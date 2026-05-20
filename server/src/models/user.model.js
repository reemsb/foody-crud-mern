import { Schema, model } from "mongoose"

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, trim: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String, index: true, sparse: true },
    avatarUrl: { type: String },
  },
  { timestamps: true, versionKey: false },
)

userSchema.method("toJSON", function () {
  const { _id, email, name, avatarUrl, createdAt } = this.toObject()
  return { _id, email, name, avatarUrl, createdAt }
})

export default model("User", userSchema)
