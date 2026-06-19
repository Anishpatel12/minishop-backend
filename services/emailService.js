const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:
        process.env.EMAIL_USER,
      pass:
        process.env.EMAIL_PASS,
    },
  });

const sendOTPEmail = async (
  email,
  otp
) => {
  await transporter.sendMail({
    from:
      process.env.EMAIL_USER,

    to: email,

    subject:
      "MiniShop Login Verification",

    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>MiniShop OTP Verification</h2>

        <p>Your login OTP is:</p>

        <h1>${otp}</h1>

        <p>Valid for 5 minutes.</p>
      </div>
    `,
  });
};

module.exports = {
  sendOTPEmail,
};