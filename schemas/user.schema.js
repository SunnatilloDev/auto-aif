const { default: mongoose } = require("mongoose");

let userSchema = new mongoose.Schema({
    number: String,
    password: String,
});

let User = mongoose.model("User", userSchema);
module.exports = User;
