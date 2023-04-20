/* eslint-disable no-unused-vars */
const Product = require("../models/Product");

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

module.exports = { createProduct, getAllProducts };
