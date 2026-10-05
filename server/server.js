const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

/* ================================
   ROUTES
================================ */

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

const app = express();

/* ================================
   MIDDLEWARE
================================ */

app.use(cors());

app.use(express.json());

/* ================================
   MONGODB CONNECTION
================================ */

/* ================================
   HOME ROUTE
================================ */

app.get("/", (req, res) => {
  res.json({
    message:
      "ShopEase API is running successfully",
  });
});

/* ================================
   CUSTOMER API ROUTES
================================ */

/* Products */

app.use(
  "/api/products",
  productRoutes
);

/* Customer Authentication */

app.use(
  "/api/auth",
  authRoutes
);

/* Admin Authentication */

app.use(
  "/api/admin/auth",
  adminAuthRoutes
);

/* Customer Orders */

app.use(
  "/api/orders",
  orderRoutes
);

/* ================================
   ADMIN API ROUTES
================================ */

/* Admin Dashboard */

app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);

/* Admin Users */

app.use(
  "/api/admin/users",
  adminUserRoutes
);

/* Admin Orders */

app.use(
  "/api/admin/orders",
  adminOrderRoutes
);

/* ================================
   SERVER
================================ */

const PORT =
  process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error.message
    );
    process.exitCode = 1;
  }
}

startServer();