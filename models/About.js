const mongoose = require("mongoose");

const aboutSchema =
  new mongoose.Schema(
    {
      companyName: String,

      description: String,

      mission: String,

      vision: String,

      email: String,

      phone: String,

      address: String,

      facebook: String,

      instagram: String,

      twitter: String,

      youtube: String,

      founderName: String,

      founderImage: String,

      bannerImage: String,
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "About",
    aboutSchema
  );