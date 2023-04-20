const mongoose = require("mongoose");

const connectDB = async (link) => {
  try {
    await mongoose.connect(link);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
