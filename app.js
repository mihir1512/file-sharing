/* eslint-disable no-unused-vars */
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

const connectDB = require("./db/connectDB");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const shareRoutes = require("./routes/shareRoutes");

const userAuthenticate = require("./middleware/authentication");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    let folderName;
    // console.log(extension);
    // if (req.url.split("")[3] == "products") {
    //   folderName = `file/${extension}`;
    // } else if (req.url.split("")[3] == "share") {
    //   folderName = `receivedFile/${extension}`;
    // }
    folderName = `file/${extension}`;
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
app.use("/file", express.static("file"));
app.use(multer({ storage: fileStorage }).single("file"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/share", shareRoutes);

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
