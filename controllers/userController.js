const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//
// GENERATE TOKEN
//
const generateToken = (id) => {
  return jwt.sign(
    { id },

    process.env.JWT_SECRET,

    {
      expiresIn: "30d",
    }
  );
};

//
// REGISTER USER
//
exports.registerUser =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      // VALIDATION
      if (
        !name ||
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            message:
              "Please Fill All Fields",
          });
      }

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
              "User Already Exists",
          });
      }

      // HASH PASSWORD
      const salt =
        await bcrypt.genSalt(
          10
        );

      const hashedPassword =
        await bcrypt.hash(
          password,
          salt
        );

      // CREATE USER
      const user =
        await User.create({
          name,

          email,

          password:
            hashedPassword,

          role: "user",
        });

      // RESPONSE
      res.status(201).json({
        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        avatar:
          user.avatar,

        token:
          generateToken(
            user._id
          ),
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

//
// LOGIN USER
//
exports.loginUser =
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      // CHECK USER
      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res
          .status(401)
          .json({
            message:
              "Invalid Email Or Password",
          });
      }

      // MATCH PASSWORD
      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {
        return res
          .status(401)
          .json({
            message:
              "Invalid Email Or Password",
          });
      }

      // RESPONSE
      res.json({
        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        avatar:
          user.avatar,

        token:
          generateToken(
            user._id
          ),
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

//
// GET ALL USERS (ADMIN)
//
exports.getUsers =
  async (req, res) => {
    try {
      const users =
        await User.find().select(
          "-password"
        );

      res.json(users);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

//
// DELETE USER (ADMIN)
//
exports.deleteUser =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User Not Found",
          });
      }

      await user.deleteOne();

      res.json({
        message:
          "User Deleted Successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

//
// GET PROFILE
//
exports.getProfile =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        ).select("-password");

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User Not Found",
          });
      }

      res.json(user);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

//
// UPDATE PROFILE
//
exports.updateProfile =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User Not Found",
          });
      }

      // UPDATE NAME
      user.name =
        req.body.name ||
        user.name;

      // UPDATE EMAIL
      user.email =
        req.body.email ||
        user.email;

      // UPDATE AVATAR
      user.avatar =
        req.body.avatar ||
        user.avatar;

      // UPDATE PASSWORD
      if (
        req.body.password
      ) {
        const salt =
          await bcrypt.genSalt(
            10
          );

        user.password =
          await bcrypt.hash(
            req.body.password,
            salt
          );
      }

      // SAVE
      await user.save();

      // RESPONSE
      res.json({
        _id: user._id,

        name: user.name,

        email: user.email,

        avatar:
          user.avatar,

        role: user.role,

        token:
          generateToken(
            user._id
          ),
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };