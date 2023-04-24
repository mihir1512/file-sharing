const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  await nodemailer.createTestAccount();
  console.log(to);
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Mihir Prajapati" <mihir.prajapati15122000@gmail.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
