const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },

    tls: {
      rejectUnauthorized: false,
    },
  });

const sendOTPEmail =
  async (email, otp) => {
    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: email,

      subject:
        "MiniShop OTP Verification",

      html: `
      <h2>Your OTP</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
      `,
    });
  };

module.exports = {
  sendOTPEmail,
};