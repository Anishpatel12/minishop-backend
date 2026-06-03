const Product = require("../models/Product");

exports.processAICommand = async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({
        success: false,
        message: "Command required",
      });
    }

    const text = command.trim();

    // ===================================
    // ADD PRODUCT
    // ===================================
    if (
      text.toLowerCase().startsWith(
        "add product"
      )
    ) {
      const regex =
        /add product (.+) price (\d+) stock (\d+) category (.+) brand (.+) description (.+)/i;

      const match =
        text.match(regex);

      if (!match) {
        return res.json({
          success: false,
          message:
            "Format: Add product NAME price 100 stock 10 category CATEGORY brand BRAND description DESCRIPTION",
        });
      }

      const product =
        await Product.create({
          title: match[1],
          price: Number(
            match[2]
          ),
          stock: Number(
            match[3]
          ),
          category:
            match[4],
          brand:
            match[5],
          description:
            match[6],
          images: [],
        });

      return res.json({
        success: true,
        message:
          "Product Added Successfully",
        product,
      });
    }

    // ===================================
    // DELETE PRODUCT
    // ===================================
    if (
      text.toLowerCase().startsWith(
        "delete product"
      )
    ) {
      const title =
        text.replace(
          /delete product/i,
          ""
        ).trim();

      const product =
        await Product.findOneAndDelete(
          {
            title: {
              $regex:
                new RegExp(
                  title,
                  "i"
                ),
            },
          }
        );

      if (!product) {
        return res.json({
          success: false,
          message:
            "Product Not Found",
        });
      }

      return res.json({
        success: true,
        message:
          "Product Deleted Successfully",
      });
    }

    // ===================================
    // UPDATE STOCK
    // ===================================
    if (
      text.toLowerCase().startsWith(
        "update stock"
      )
    ) {
      const regex =
        /update stock (.+) (\d+)/i;

      const match =
        text.match(regex);

      if (!match) {
        return res.json({
          success: false,
          message:
            "Format: Update stock PRODUCT_NAME 100",
        });
      }

      const title =
        match[1];

      const stock =
        Number(
          match[2]
        );

      const product =
        await Product.findOneAndUpdate(
          {
            title: {
              $regex:
                new RegExp(
                  title,
                  "i"
                ),
            },
          },
          { stock },
          { new: true }
        );

      if (!product) {
        return res.json({
          success: false,
          message:
            "Product Not Found",
        });
      }

      return res.json({
        success: true,
        message:
          "Stock Updated Successfully",
        product,
      });
    }

    // ===================================
    // FIND PRODUCT
    // ===================================
    if (
      text.toLowerCase().startsWith(
        "find product"
      )
    ) {
      const title =
        text.replace(
          /find product/i,
          ""
        ).trim();

      const product =
        await Product.findOne({
          title: {
            $regex:
              new RegExp(
                title,
                "i"
              ),
          },
        });

      if (!product) {
        return res.json({
          success: false,
          message:
            "Product Not Found",
        });
      }

      return res.json({
        success: true,
        product,
      });
    }

    return res.json({
      success: false,
      message:
        "Unknown Command",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};