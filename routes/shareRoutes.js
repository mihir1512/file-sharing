/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const {
  shareFile,
  getAllFiles,
  getSingleFile,
  deleteFile,
} = require("../controllers/shareController");

router
  .route("/")
  .post(authenticateUser, shareFile)
  .get(authenticateUser, getAllFiles);

router
  .route("/:id")
  .get(authenticateUser, getSingleFile)
  .delete(authenticateUser, deleteFile);
module.exports = router;
