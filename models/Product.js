const mongoose = require("mongoose");

const productSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      category: {
        type: String,
        required: true,
      },

      brand: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      images: [
        {
          type: String,
        },
      ],

      stock: {
  type: Number,
  required: true,
  default: 0,
},

      featured: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Product",
    productSchema
  );