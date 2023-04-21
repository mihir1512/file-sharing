/* eslint-disable no-unused-vars */
const jwt = require("jsonwebtoken");

const userAuthenticate = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  // eslint-disable-next-line no-undef
  const payload = await jwt.verify(token, process.env.JWT_SECRET);
  if (payload) {
    req.user = { id: payload.id };
    // console.log(req.user);
    next();
  } else {
    res.status(201).json({ msg: "Invalid email or password" });
  }
};

module.exports = userAuthenticate;
