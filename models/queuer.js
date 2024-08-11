const mongoose = require("mongoose");

const queuerSchema = new mongoose.Schema(
  {
    fullName: String,
    number: String,
    password: String,
    paymentImage: String,
  },
  { timestamps: true }
);

const Queuer = mongoose.model("Queuer", queuerSchema);
module.exports = Queuer;
