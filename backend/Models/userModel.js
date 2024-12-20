const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPassword: { type: String, required: true, unique: true },
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
