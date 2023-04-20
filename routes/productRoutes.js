/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router
  .route("/")
  .post(authenticateUser, createProduct)
  .get(authenticateUser, getAllProducts);

router.route("/:id").get();

module.exports = router;
