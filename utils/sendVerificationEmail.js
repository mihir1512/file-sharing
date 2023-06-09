/* eslint-disable no-unused-vars */
const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const resetUrl = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  console.log(verificationToken);
  const message = `<p> Please verify email by clicking on the following link: 
    <a href="${resetUrl}">Verify Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello, ${name}</h4>
        ${message}`,
  });
};

module.exports = sendVerificationEmail;
