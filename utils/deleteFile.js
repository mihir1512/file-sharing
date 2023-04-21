/* eslint-disable no-unused-vars */
const fs = require("fs");

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = deleteFile;
