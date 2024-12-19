const mongoose = require("mongoose");
const UserModel = require("./userModel");

const projectSchema = mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  borrower: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }],
  title: { type: String, required: true },
  buffer: { type: String },
  createTIme: { type: date.now() },
});
