const mongoose = require("mongoose");

const orderSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      products: [
        {
          productId: {
            type:
              mongoose.Schema.Types.ObjectId,

            ref: "Product",

            required: true,
          },

          title: String,

          price: Number,

          image: String,

          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],

      shipping: {
        fullName: {
          type: String,
          required: true,
        },

        phone: {
          type: String,
          required: true,
        },

        address: {
          type: String,
          required: true,
        },

        landmark: String,

        city: {
          type: String,
          required: true,
        },

        state: {
          type: String,
          required: true,
        },

        country: {
          type: String,
          default: "India",
        },

        pincode: {
          type: String,
          required: true,
        },

        latitude: Number,

        longitude: Number,
      },

      total: {
        type: Number,
        required: true,
      },

      itemsCount: {
        type: Number,
        default: 0,
      },

      paymentMethod: {
        type: String,
        default: "COD",
      },

      paymentStatus: {
        type: String,

        enum: [
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
        ],

        default: "Pending",
      },

      status: {
        type: String,

        enum: [
          "Processing",
          "Shipped",
          "Out For Delivery",
          "Delivered",
          "Cancelled",
        ],

        default: "Processing",
      },

      trackingSteps: [
        {
          title: String,

          completed: {
            type: Boolean,
            default: false,
          },

          completedAt: Date,
        },
      ],

      estimatedDelivery: {
        type: String,
        default:
          "2-4 Business Days",
      },

      orderNotes: {
        type: String,
        default: "",
      },

      deliveredAt: Date,

      cancelledAt: Date,
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );