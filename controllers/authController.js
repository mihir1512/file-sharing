/* eslint-disable no-unused-vars */
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const createHash = require("../utils/createHash");
const crypto = require("crypto");

require("dotenv").config();

const register = async (req, res, next) => {
  const { userName, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(40).toString("hex");
    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      verificationToken: verificationToken,
    });

    console.log(verificationToken);
    const origin = "http://localhost:3000";
    await sendVerificationEmail({
      name: user.userName,
      email: user.email,
      verificationToken: verificationToken,
      origin,
    });
    res.status(201).json({
      msg: "Success! Please check your email to verify account",
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ msg: "verification failed" });
  }

  if (user.verificationToken !== verificationToken) {
    console.log(verificationToken);
    return res.status(400).json({ msg: "verification failed" });
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(200).json({ msg: "Email Verified" });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      console.log(user);
      if (!user.isVerified) {
        res.status(201).json({ msg: "Please verify your email" });
      }
      const pwd = await bcrypt.compare(password, user.password);
      if (pwd) {
        const token = await jwt.sign(
          { id: user._id, email: user.email },
          // eslint-disable-next-line no-undef
          process.env.JWT_SECRET,
          { expiresIn: "10h" }
        );

        return res
          .status(200)
          .json({ token: token, msg: "Successsully loggedin" });
      } else {
        return res.status(401).json({ msg: "Incorrect email or password" });
      }
    } else {
      return res.status(401).json({ msg: "Incorrect email or password" });
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const origin = "http://localhost:3000";
    await sendResetPasswordEmail({
      name: user.userName,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res.status(200).json({ msg: "Please check your email for reset link" });
};

const resetPassword = async (req, res, next) => {
  const { token, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = hashedPassword;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.send("reset password");
};
const updateUser = async (req, res, next) => {
  const userId = req.user.id;
  const { userName, email } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { userName, email },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(401).json({ msg: "Incorrect user id" });
  }
  res.status(201).json({ msg: "Updated Successfully" });
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  updateUser,
};
