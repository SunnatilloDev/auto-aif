const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB successfully");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
