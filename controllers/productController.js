/* eslint-disable no-unused-vars */
const Product = require("../models/Product");
const deleteFile = require("../utils/deleteFile");

const createProduct = async (req, res, next) => {
  const file = req.file;
  const productName = req.body.name;
  const path = file.path;

  try {
    const product = await Product.create({
      name: productName,
      path: path,
      user: req.user.id,
    });
    res.status(201).json({ product });
  } catch (error) {
    console.log(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
};

const getSingleProduct = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const products = await Product.find({ _id: productId });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const file = req.file;
  const productName = req.body.name;
  const path = file.path;
  const product = await Product.findOne({ _id: productId });
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId },
    { name: productName, path: path, user: req.user.id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    return res.status(401).json({ msg: `No product with id : ${productId}` });
  }
  deleteFile(product.path);
  res.status(200).json({ product });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    return res.status(401).json({ msg: `No product with id : ${productId}` });
  }

  deleteFile(product.path);

  await Product.findOneAndDelete({ _id: productId });
  res.status(200).json({ msg: "Success! Product removed." });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
