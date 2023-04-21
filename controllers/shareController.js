/* eslint-disable no-unused-vars */
const User = require("../models/User");
const Product = require("../models/Product");

const shareFile = async (req, res, next) => {
  const { userName, productId } = req.body;
  const user = await User.findOne({ userName: userName });
  if (!user || !user.isVerified) {
    return res.status(401).json({ msg: "User not found" });
  }
  const product = await Product.findOne({ _id: productId, user: req.user.id });
  if (!product) {
    return res.status(401).json({ msg: "Incorrect Data" });
  }
  const temp = {
    userId: req.user.id,
    product: productId,
    time: Date.now(),
  };
  user.receivedFile.push(temp);
  const updatedUser = await user.save();
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
  const user = await User.findOne({
    _id: req.user.id,
    receivedFile: { $elemMatch: { product: productId } },
  }).populate({
    path: "receivedFile.product",
  });
  // _id: req.user.id,

  // console.log(product);
};

module.exports = { shareFile, getAllFiles, getSingleFile };
