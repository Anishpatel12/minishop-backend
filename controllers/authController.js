const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

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
exports.loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // FIND USER
    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res
        .status(400)
        .json({
          message:
            "Invalid Credentials",
        });
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res
        .status(400)
        .json({
          message:
            "Invalid Credentials",
        });
    }

    // TOKEN
    const token =
      generateToken(user._id);

    res.json({
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