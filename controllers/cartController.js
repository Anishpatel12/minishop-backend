const Cart = require("../models/Cart");

//
// GET CART
//
exports.getCart =
  async (req, res) => {
    try {
      let cart =
        await Cart.findOne({
          user: req.user._id,
        });

      // CREATE EMPTY CART
      if (!cart) {
        cart =
          await Cart.create({
            user: req.user._id,

            items: [],
          });
      }

      res.json(cart);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

//
// ADD TO CART
//
exports.addToCart =
  async (req, res) => {
    try {
      const {
        productId,
        title,
        price,
        image,
        quantity,
      } = req.body;

      let cart =
        await Cart.findOne({
          user: req.user._id,
        });

      // CREATE CART
      if (!cart) {
        cart =
          await Cart.create({
            user: req.user._id,

            items: [],
          });
      }

      // CHECK PRODUCT
      const existingItem =
        cart.items.find(
          (item) =>
            item.productId.toString() ===
            productId
        );

      if (existingItem) {
        existingItem.quantity +=
          quantity || 1;
      } else {
        cart.items.push({
          productId,

          title,

          price,

          image,

          quantity:
            quantity || 1,
        });
      }

      await cart.save();

      res.json(cart);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

//
// REMOVE ITEM
//
exports.removeFromCart =
  async (req, res) => {
    try {
      const cart =
        await Cart.findOne({
          user: req.user._id,
        });

      if (!cart) {
        return res
          .status(404)
          .json({
            message:
              "Cart Not Found",
          });
      }

      cart.items =
        cart.items.filter(
          (item) =>
            item.productId.toString() !==
            req.params.id
        );

      await cart.save();

      res.json(cart);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

//
// CLEAR CART
//
exports.clearCart =
  async (req, res) => {
    try {
      const cart =
        await Cart.findOne({
          user: req.user._id,
        });

      if (!cart) {
        return res
          .status(404)
          .json({
            message:
              "Cart Not Found",
          });
      }

      cart.items = [];

      await cart.save();

      res.json({
        message:
          "Cart Cleared",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };