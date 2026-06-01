const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const productRoutes = require(
  "./routes/productRoutes"
);
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require(
  "./routes/orderRoutes"
);
const cartRoutes = require(
  "./routes/cartRoutes"
);
const categoryRoutes = require(
  "./routes/categoryRoutes"
);

dotenv.config();

// DATABASE
connectDB();

const app = express();

// MIDDLEWARE
app.use(cors());

app.use(express.json());

// ROUTES
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

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running...");
});

// SERVER
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});