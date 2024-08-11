const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    number: String,
    password: String,
    isDone: {
      type: Boolean,
      default: false,
    },
    todaysBalance: Number,
    allBalance: Number,
    packages: [String],
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
