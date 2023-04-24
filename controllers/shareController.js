/* eslint-disable no-unused-vars */
const User = require("../models/User");
const Product = require("../models/Product");
const sendEmail = require("../utils/sendEmail");

const shareFile = async (req, res, next) => {
  const { userName, productId } = req.body;
  const sender = await User.findOne({ _id: req.user.id });
  const user = await User.findOne({ userName: userName });
  if (!user || !user.isVerified) {
    return res.status(401).json({ msg: "User not found" });
  }
  const product = await Product.findOne({
    _id: productId,
    user: req.user.id,
  });
  console.log(product);
  if (!product) {
    return res
      .status(401)
      .json({ msg: "You are not allowed to access this file" });
  }
  if (product.permission == "public") {
    return res
      .status(401)
      .json({ msg: "This file is already accessible by everyone" });
  }
  const temp = {
    userId: req.user.id,
  };
  product.sharedWith.push(temp);
  const updatedUser = await product.save();
  console.log(user.email);
  const html = `<p>${sender.userName} send you ${product.name}`;
  await sendEmail({ to: user.email, subject: "Sharing File", html });
  res.status(201).json({ msg: "shared successfully" });
};

const getAllFiles = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findOne({ _id: userId }).populate([
    {
      path: "receivedFile.product",
      model: "Product",
    },
  ]);
  res.status(200).json({ files: user.receivedFile });
};

const getSingleFile = async (req, res, next) => {
  const productId = req.params.id;
  console.log(productId);
  const user = await User.findOne({ _id: req.user.id });
  const fileId = user.receivedFile.find((file) => {
    return (file.product = productId);
  });
  if (!fileId) {
    return res.status(404).json({ msg: "file does not exist" });
  }
  const product = await Product.findOne({ _id: fileId.product });
  console.log(product);
  res.status(200).json({ product });
  // _id: req.user.id,
};

const deleteFile = async (req, res, next) => {
  const productId = req.params.id;
  console.log(productId);
  const user = await User.findOne({ _id: req.user.id });
  const fileId = user.receivedFile.find((file) => {
    return (file.product = productId);
  });
  if (!fileId) {
    return res.status(404).json({ msg: "file does not exist" });
  }
  const files = user.receivedFile.filter((file) => {
    return file.product !== fileId.product;
  });
  user.receivedFile = files;
  await user.save();

  res.status(200).json({ msg: "successfully deleted" });
};

module.exports = { shareFile, getAllFiles, getSingleFile, deleteFile };
