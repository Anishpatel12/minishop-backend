const mongoose =
  require("mongoose");

const categorySchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        unique: true,
      },

      image: {
        type: String,
        default: "",
      },

      color: {
        type: String,
        default:
          "from-blue-500 to-indigo-600",
      },

      status: {
        type: String,
        enum: [
          "Active",
          "Inactive",
        ],
        default: "Active",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Category",
    categorySchema
  );