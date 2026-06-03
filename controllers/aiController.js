const Product = require("../models/Product");

exports.processAICommand =
  async (req, res) => {
    try {
      const { command } = req.body;

      const text =
        command.toLowerCase();

      // ADD STOCK
      if (
        text.includes(
          "increase stock"
        )
      ) {
        return res.json({
          success: true,
          message:
            "Stock command detected",
        });
      }

      return res.json({
        success: true,
        message:
          "Command received",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };