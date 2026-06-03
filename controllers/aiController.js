const Product = require("../models/Product");

const {
  parseProduct,
} = require(
  "../services/geminiService"
);

function getImageUrl(title) {
  return `https://source.unsplash.com/600x600/?${encodeURIComponent(
    title
  )}`;
}

exports.processAICommand =
  async (req, res) => {
    try {
      const { command } =
        req.body;

      if (!command) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Command required",
          });
      }

      const text =
        command.trim();

      // ===================================
      // ADD PRODUCT USING GEMINI
      // ===================================
      if (
        text
          .toLowerCase()
          .startsWith("add")
      ) {
        const data =
          await parseProduct(
            command
          );

        const product =
          await Product.create({
            title:
              data.title,
            price:
              Number(
                data.price
              ) || 0,
            stock:
              Number(
                data.stock
              ) || 0,
            category:
              data.category ||
              "General",
            brand:
              data.brand ||
              "Unknown",
            description:
              data.description ||
              "",

            images: [
              getImageUrl(
                data.title
              ),
            ],
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
        text
          .toLowerCase()
          .startsWith(
            "delete product"
          )
      ) {
        const title =
          text
            .replace(
              /delete product/i,
              ""
            )
            .trim();

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
        text
          .toLowerCase()
          .startsWith(
            "update stock"
          )
      ) {
        const regex =
          /update stock (.+) (\d+)/i;

        const match =
          text.match(
            regex
          );

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
            {
              new: true,
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
            "Stock Updated Successfully",
          product,
        });
      }

      // ===================================
      // FIND PRODUCT
      // ===================================
      if (
        text
          .toLowerCase()
          .startsWith(
            "find product"
          )
      ) {
        const title =
          text
            .replace(
              /find product/i,
              ""
            )
            .trim();

        const product =
          await Product.findOne(
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
          product,
        });
      }

      return res.json({
        success: false,
        message:
          "Unknown Command",
      });
    } catch (error) {
      console.error(
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };