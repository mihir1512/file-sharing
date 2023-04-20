/* eslint-disable no-unused-vars */
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

const connectDB = require("./db/connectDB");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(file);
    const folderName = `file/${file.mimetype}`;
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    cb(null, folderName);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

app.use(bodyParser.json());

app.use(multer({ storage: fileStorage }).single("file"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

const databaseConnection = async () => {
  try {
    // eslint-disable-next-line no-undef
    await connectDB(process.env.MONGODB_URI);
    app.listen(5000);
  } catch (error) {
    console.log(error);
  }
};

databaseConnection();
