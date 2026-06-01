// backend/controllers/orderController.js

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

//
// TRACKING TEMPLATE
//
const createTrackingSteps = () => [
  {
    title: "Processing",
    completed: true,
    completedAt: new Date(),
  },
  {
    title: "Shipped",
    completed: false,
  },
  {
    title: "Out For Delivery",
    completed: false,
  },
  {
    title: "Delivered",
    completed: false,
  },
];
exports.searchOrders =
  async (req, res) => {
    try {
      const keyword =
        req.query.q || "";

      const orders =
        await Order.find({
          $or: [
            {
              status: {
                $regex:
                  keyword,
                $options:
                  "i",
              },
            },
            {
              "shipping.fullName":
                {
                  $regex:
                    keyword,
                  $options:
                    "i",
                },
            },
            {
              "shipping.phone":
                {
                  $regex:
                    keyword,
                  $options:
                    "i",
                },
            },
            {
              "shipping.city":
                {
                  $regex:
                    keyword,
                  $options:
                    "i",
                },
            },
          ],
        })
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json(orders);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Search Failed",
      });
    }
  };
//
// CREATE ORDER
//
exports.createOrder = async (
  req,
  res
) => {
  try {
    const {
      products,
      shipping,
      total,
      paymentMethod,
    } = req.body;

    if (
      !products ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: "Cart Is Empty",
      });
    }

    if (
      !shipping?.fullName ||
      !shipping?.phone ||
      !shipping?.address ||
      !shipping?.city ||
      !shipping?.state ||
      !shipping?.pincode
    ) {
      return res.status(400).json({
        message:
          "Please Fill Shipping Details",
      });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    //
    // STOCK CHECK
    //
    for (const item of products) {
      const product =
        await Product.findById(
          item._id ||
            item.productId
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product Not Found",
        });
      }

      if (
        product.stock <
        item.quantity
      ) {
        return res.status(400).json({
          message:
            `${product.title} has only ${product.stock} items left`,
        });
      }
    }

    //
    // ADDRESS HISTORY
    //
    if (!user.addresses) {
      user.addresses = [];
    }

    const addressExists =
      user.addresses.some(
        (addr) =>
          addr.address ===
            shipping.address &&
          addr.pincode ===
            shipping.pincode
      );

    if (!addressExists) {
      user.addresses.push({
        fullName:
          shipping.fullName,

        phone:
          shipping.phone,

        address:
          shipping.address,

        landmark:
          shipping.landmark ||
          "",

        city:
          shipping.city,

        state:
          shipping.state,

        country:
          shipping.country ||
          "India",

        pincode:
          shipping.pincode,
      });

      await user.save();
    }

    //
    // PREPARE PRODUCTS
    //
    const orderProducts =
      products.map(
        (product) => ({
          productId:
            product._id ||
            product.productId,

          title:
            product.title,

          price:
            product.price,

          image:
            product.image,

          quantity:
            product.quantity || 1,
        })
      );

    //
    // CREATE ORDER
    //
    const order =
      await Order.create({
        user: req.user._id,

        products:
          orderProducts,

        shipping,

        total,

        paymentMethod:
          paymentMethod ||
          "COD",

        paymentStatus:
          paymentMethod ===
          "COD"
            ? "Pending"
            : "Paid",

        status:
          "Processing",

        trackingSteps:
          createTrackingSteps(),

        estimatedDelivery:
          "2-4 Business Days",

        orderNotes:
          "Order Successfully Placed",

        itemsCount:
          orderProducts.reduce(
            (
              sum,
              item
            ) =>
              sum +
              (item.quantity ||
                1),
            0
          ),
      });

    res.status(201).json(
      order
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

//
// USER ORDERS
//
exports.getMyOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.json(orders);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

//
// ADMIN ORDERS
//
exports.getOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find()
          .populate(
            "user",
            "name email avatar"
          )
          .sort({
            createdAt: -1,
          });

      res.json(orders);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

//
// UPDATE ORDER STATUS
//
exports.updateOrderStatus =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order Not Found",
        });
      }

      const status =
        req.body.status;

      const previousStatus =
        order.status;

      order.status = status;

      if (
        !order.trackingSteps ||
        order.trackingSteps.length ===
          0
      ) {
        order.trackingSteps =
          createTrackingSteps();
      }

      //
      // RESET TRACKING
      //
      order.trackingSteps.forEach(
        (step) => {
          step.completed = false;
        }
      );

      //
      // PROCESSING
      //
      if (
        status ===
        "Processing"
      ) {
        order.trackingSteps[0].completed =
          true;
      }

      //
      // SHIPPED
      //
      if (
        status ===
        "Shipped"
      ) {
        order.trackingSteps[0].completed =
          true;

        order.trackingSteps[1].completed =
          true;
      }

      //
      // OUT FOR DELIVERY
      //
      if (
        status ===
        "Out For Delivery"
      ) {
        order.trackingSteps[0].completed =
          true;

        order.trackingSteps[1].completed =
          true;

        order.trackingSteps[2].completed =
          true;
      }

      //
      // DELIVERED
      //
      if (
        status ===
          "Delivered" &&
        previousStatus !==
          "Delivered"
      ) {
        order.trackingSteps[0].completed =
          true;

        order.trackingSteps[1].completed =
          true;

        order.trackingSteps[2].completed =
          true;

        order.trackingSteps[3].completed =
          true;

        order.deliveredAt =
          new Date();

        //
        // REDUCE STOCK
        //
        for (const item of order.products) {
          const product =
            await Product.findById(
              item.productId
            );

          if (product) {
            product.stock =
              Math.max(
                0,
                product.stock -
                  item.quantity
              );

            await product.save();
          }
        }
      }

      //
      // CANCELLED
      //
      if (
        status ===
        "Cancelled"
      ) {
        order.cancelledAt =
          new Date();
      }

      //
      // COMPLETION TIME
      //
      order.trackingSteps.forEach(
        (step) => {
          if (
            step.completed &&
            !step.completedAt
          ) {
            step.completedAt =
              new Date();
          }
        }
      );

      order.orderNotes = `Order status updated to ${status}`;

      await order.save();

      res.json(order);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

//
// CANCEL ORDER
//
exports.cancelOrder =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order Not Found",
        });
      }

      if (
        order.user.toString() !==
        req.user._id.toString()
      ) {
        return res.status(401).json({
          message:
            "Not Authorized",
        });
      }

      if (
        order.status ===
        "Delivered"
      ) {
        return res.status(400).json({
          message:
            "Delivered orders cannot be cancelled",
        });
      }

      order.status =
        "Cancelled";

      order.cancelledAt =
        new Date();

      order.orderNotes =
        "Order Cancelled By User";

      await order.save();

      res.json({
        message:
          "Order Cancelled Successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

//
// LATEST ORDER
//
exports.getLatestOrder =
  async (req, res) => {
    try {
      const order =
        await Order.findOne({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      if (!order) {
        return res.status(404).json({
          message:
            "No Order Found",
        });
      }

      res.json(order);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

//
// TRACK ORDER
//
exports.trackOrder =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order Not Found",
        });
      }

      if (
        order.user.toString() !==
          req.user._id.toString() &&
        req.user.role !==
          "admin"
      ) {
        return res.status(401).json({
          message:
            "Not Authorized",
        });
      }

      res.json(order);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };