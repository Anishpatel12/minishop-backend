
// server/services/emailService.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// SMTP TEST
transporter.verify((error, success) => {
  if (error) {
    console.error(
      "SMTP VERIFY ERROR:",
      error
    );
  } else {
    console.log(
      "SMTP SERVER READY"
    );
  }
});

const sendOTPEmail = async (
  email,
  otp
) => {
  try {
    console.log(
      "================================="
    );
    console.log(
      "Sending email to:",
      email
    );
    console.log(
      "EMAIL_USER:",
      process.env.EMAIL_USER
    );

    const info =
      await transporter.sendMail({
        from: `"MiniShop" <${process.env.EMAIL_USER}>`,

        to: email,

        subject:
          "MiniShop OTP Verification",

        html: `
          <div style="font-family:Arial;padding:20px">
            <h2>MiniShop Login Verification</h2>

            <p>Your OTP is:</p>

            <h1 style="color:#2563eb">
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
      "MESSAGE ID:",
      info.messageId
    );

    console.log(
      "SMTP RESPONSE:",
      info.response
    );

    console.log(
      "================================="
    );

    return true;
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "EMAIL ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );

    throw error;
  }
};

module.exports = {
  sendOTPEmail,
};
