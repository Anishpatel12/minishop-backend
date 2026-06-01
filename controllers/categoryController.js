const Category =
  require("../models/Category");

const Product =
  require("../models/Product");

//
// GET ALL
//
exports.getCategories =
  async (req, res) => {
    try {
      const categories =
        await Category.find().sort({
          createdAt: -1,
        });

      const result =
        await Promise.all(
          categories.map(
            async (
              category
            ) => {
              const productCount =
                await Product.countDocuments(
                  {
                    category:
                      category.title,
                  }
                );

              return {
                ...category.toObject(),
                productCount,
              };
            }
          )
        );

      res.json(result);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed To Load Categories",
      });
    }
  };
// CREATE
//
exports.createCategory =
  async (req, res) => {
    try {
      const category =
        await Category.create(
          req.body
        );

      res.status(201).json(
        category
      );
    } catch (error) {
      res.status(500).json({
        message:
          "Create Failed",
      });
    }
  };

//
// UPDATE
//
exports.updateCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(category);
    } catch (error) {
      res.status(500).json({
        message:
          "Update Failed",
      });
    }
  };

//
// DELETE
//
exports.deleteCategory =
  async (req, res) => {
    try {
      await Category.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Category Deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Delete Failed",
      });
    }
  };