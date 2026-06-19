const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const {
  sendOTPEmail,
} = require(
  "../services/emailService"
);

// TOKEN
const generateToken = (id) => {
  return jwt.sign(
    { id },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};

// REGISTER
exports.registerUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // CHECK USER
    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {
      return res
        .status(400)
        .json({
          message:
            "User already exists",
        });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // CHECK ADMIN EXISTS
    const adminExists =
      await User.findOne({
        role: "admin",
      });

    // FIRST USER = ADMIN
    const role = adminExists
      ? "user"
      : "admin";

    // CREATE USER
    const user =
      await User.create({
        name,

        email,

        password:
          hashedPassword,

        role,
      });

    // TOKEN
    const token =
      generateToken(user._id);

    res.status(201).json({
      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Server Error",
    });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  console.log("LOGIN API HIT");

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log("Generated OTP:", otp);

    user.otp = otp;

    user.otpExpiry =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log(
      "Sending OTP to:",
      user.email
    );

    await sendOTPEmail(
      user.email,
      otp
    );

    console.log(
      "OTP Email Sent Successfully"
    );

    return res.json({
      success: true,
      otpRequired: true,
      email: user.email,
      message:
        "OTP sent to your email",
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
}; // <-- YE MISSING THA
exports.verifyOTP =
  async (req, res) => {
    try {
      const {
        email,
        otp,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res
          .status(400)
          .json({
            message:
              "User not found",
          });
      }

      if (
        user.otp !== otp
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid OTP",
          });
      }

      if (
        Date.now() >
        user.otpExpiry
      ) {
        return res
          .status(400)
          .json({
            message:
              "OTP Expired",
          });
      }

      user.otp = "";
      user.otpExpiry =
        null;

      user.lastLogin =
        new Date();

      await user.save();

      const token =
        generateToken(
          user._id
        );

      res.json({
        success: true,
        token,

        user: {
          id: user._id,
          name:
            user.name,
          email:
            user.email,
          role:
            user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

// PROFILE
exports.getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      );

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message:
        "Server Error",
    });
  }
};