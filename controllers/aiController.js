const Product = require("../models/Product");
const Order = require("../models/Order");
const {
  parseProduct,
  generateProducts,
} = require(
  "../services/groqService"
);

function getImageUrl(title) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
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
console.log(
  "AI COMMAND:",
  text
);
        // ===================================
// GENERATE PRODUCTS
// ===================================

if (
  text
    .toLowerCase()
    .startsWith("generate")
) {

  const products =
    await generateProducts(
      command
    );

  const savedProducts =
    await Product.insertMany(
      products.map((p) => ({
        title: p.title,
        price:
          Number(p.price) || 0,

        stock:
          Number(p.stock) || 0,

        category:
          p.category ||
          "General",

        brand:
          p.brand ||
          "Unknown",

        description:
          p.description ||
          "",

        images: [
          getImageUrl(
            p.title
          ),
        ],
      }))
    );

  return res.json({
    success: true,
    message: `${savedProducts.length} Products Generated Successfully`,
    count:
      savedProducts.length,
  });
}
      // ===================================
      // ADD PRODUCT USING GROQ
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
// INVENTORY ANALYTICS
// ===================================
// ===================================
// INVENTORY ANALYTICS
// ===================================

if (
  text
    .toLowerCase()
    .includes(
      "analyze inventory"
    )
) {
  const products =
    await Product.find();

  const totalProducts =
    products.length;

  const lowStock =
    products.filter(
      (p) =>
        p.stock > 0 &&
        p.stock <= 5
    );

  const outOfStock =
    products.filter(
      (p) => p.stock === 0
    );

  const featured =
    products.filter(
      (p) => p.featured
    );

  const recommendations =
    lowStock.map((p) => ({
      title: p.title,
      currentStock:
        p.stock,
      suggestedRestock:
        Math.max(
          50,
          100 - p.stock
        ),
    }));

  return res.json({
    success: true,
    message:
      "Inventory Analysis Complete",

    analytics: {
      totalProducts,
      lowStock,
      outOfStock,
      featuredCount:
        featured.length,
      recommendations,
    },
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