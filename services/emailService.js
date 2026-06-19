// server/services/emailService.js

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
    try {
      console.log(
        "Sending email to:",
        email
      );

      const info =
        await transporter.sendMail({
          from: `"MiniShop" <${process.env.EMAIL_USER}>`,

          to: email,

          subject:
            "MiniShop OTP Verification",

          html: `
            <div style="font-family: Arial; padding:20px">
              <h2>MiniShop Login Verification</h2>

              <p>Your OTP is:</p>

              <h1 style="color:#2563eb;">
                ${otp}
              </h1>

              <p>
                This OTP is valid for
                5 minutes.
              </p>
            </div>
          `,
        });

      console.log(
        "EMAIL SENT SUCCESSFULLY"
      );

      console.log(
        "Message ID:",
        info.messageId
      );

      console.log(
        "Response:",
        info.response
      );

      return true;
    } catch (error) {
      console.error(
        "EMAIL SEND ERROR:"
      );

      console.error(error);

      throw error;
    }
  };

module.exports = {
  sendOTPEmail,
};