const { Resend } = require("resend");

const resend = new Resend(
process.env.RESEND_API_KEY
);

const sendOTPEmail = async (
email,
otp
) => {
try {
const response =
await resend.emails.send({
from:
"MiniShop [onboarding@resend.dev](mailto:onboarding@resend.dev)",

    to: email,

    subject:
      "MiniShop OTP Verification",

    html: `
      <h2>MiniShop Login Verification</h2>

      <h1>${otp}</h1>

      <p>
        This OTP is valid for
        5 minutes.
      </p>
    `,
  });

console.log(
  "EMAIL SENT:",
  response
);

return true;

} catch (error) {
console.error(
"EMAIL ERROR:",
error
);
throw error;

}
};

module.exports = {
sendOTPEmail,
};
