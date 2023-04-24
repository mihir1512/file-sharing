/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
    },
    path: {
      type: String,
      required: [true, "Please provide path"],
    },
    permission: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [
      {
        userId: { type: mongoose.Types.ObjectId, ref: "User" },
        time: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
