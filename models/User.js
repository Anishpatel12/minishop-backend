// backend/models/User.js

const mongoose = require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      //
      // NAME
      //
      name: {
        type: String,

        required: true,

        trim: true,
      },

      //
      // EMAIL
      //
      email: {
        type: String,

        required: true,

        unique: true,

        lowercase: true,

        trim: true,
      },

      //
      // PASSWORD
      //
      password: {
        type: String,

        required: true,
      },

      //
      // ROLE
      //
      role: {
        type: String,

        enum: [
          "user",
          "admin",
        ],

        default: "user",
      },

      //
      // PROFILE IMAGE
      //
      avatar: {
        type: String,

        default:
          "https://i.pravatar.cc/300",
      },

      //
      // PHONE
      //
      phone: {
        type: String,

        default: "",
      },

      //
      // ADDRESS HISTORY
      //
      addresses: [
        {
          fullName: {
            type: String,
          },

          phone: {
            type: String,
          },

          address: {
            type: String,
          },

          landmark: {
            type: String,
          },

          city: {
            type: String,
          },

          state: {
            type: String,
          },

          country: {
            type: String,

            default:
              "India",
          },

          pincode: {
            type: String,
          },
        },
      ],

      //
      // ACCOUNT STATUS
      //
      isBlocked: {
        type: Boolean,

        default: false,
      },

      //
      // EMAIL VERIFIED
      //
      isVerified: {
        type: Boolean,

        default: false,
      },
      otp: {
  type: String,
  default: "",
},

otpExpiry: {
  type: Date,
},

      //
      // LAST LOGIN
      //
      lastLogin: {
        type: Date,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );