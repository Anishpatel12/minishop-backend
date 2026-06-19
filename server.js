require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Connect Database
connectDB();

const app = express();

/* ===========================
   CORS CONFIG
=========================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://minishop-lovat.vercel.app",
  "https://minishop-rr2g20ru7-anishpatel12s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / Mobile Browser / Direct API
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          "CORS Not Allowed"
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* ===========================
   BODY PARSER
=========================== */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ===========================
   HEALTH CHECK
=========================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Mini Shop API Running",
  });
});

/* ===========================
   API ROUTES
=========================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/about",
  aboutRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

/* ===========================
   404 ROUTE
=========================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      "Route Not Found",
  });
});

/* ===========================
   GLOBAL ERROR HANDLER
=========================== */

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(
      "SERVER ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Server Error",
    });
  }
);

/* ===========================
   START SERVER
=========================== */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});