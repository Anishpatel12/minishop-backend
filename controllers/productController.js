const Product = require("../models/Product");

// GET ALL PRODUCTS
exports.getProducts = async (
  req,
  res
) => {
  try {
    const products =
      await Product.find().sort({
        createdAt: -1,
      });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message:
        "Server Error",
    });
  }
};

// GET SINGLE PRODUCT
exports.getProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res
        .status(404)
        .json({
          message:
            "Product not found",
        });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message:
        "Server Error",
    });
  }
};

// ADD PRODUCT
exports.createProduct = async (
  req,
  res
) => {
  try {
    const {
      title,
      price,
      category,
      brand,
      description,
      images,
      stock,
      featured,
    } = req.body;

    const product =
      await Product.create({
        title,

        price,

        category,

        brand,

        description,

        images,

        stock,

        featured,
      });

    res.status(201).json(
      product
    );
  } catch (error) {
    res.status(500).json({
      message:
        "Server Error",
    });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res
        .status(404)
        .json({
          message:
            "Product not found",
        });
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,

        req.body,

        {
          new: true,
        }
      );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message:
        "Server Error",
    });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res
        .status(404)
        .json({
          message:
            "Product not found",
        });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Product Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Server Error",
    });
  }
};
// SEARCH PRODUCTS
exports.searchProducts =
  async (req, res) => {
    try {
      const keyword =
        req.query.q?.trim() ||
        "";

      const products =
        await Product.find({
          $or: [
            {
              title: {
                $regex:
                  keyword,
                $options:
                  "i",
              },
            },
            {
              category: {
                $regex:
                  keyword,
                $options:
                  "i",
              },
            },
            {
              brand: {
                $regex:
                  keyword,
                $options:
                  "i",
              },
            },
          ],
        }).sort({
          createdAt: -1,
        });

      res.json(products);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Search Failed",
        error:
          error.message,
      });
    }
  };