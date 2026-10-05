const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/stats",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();

      const totalProducts =
        await Product.countDocuments();

      const totalOrders =
        await Order.countDocuments();

      // -----------------------------
      // TOTAL REVENUE
      // -----------------------------
      const revenueResult =
        await Order.aggregate([
          {
            $match: {
              orderStatus: {
                $ne: "Cancelled",
              },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$total",
              },
            },
          },
        ]);

      const totalRevenue =
        revenueResult.length > 0
          ? revenueResult[0].totalRevenue
          : 0;

      // -----------------------------
      // ORDER STATUS COUNTS
      // -----------------------------
      const orderStatusResult =
        await Order.aggregate([
          {
            $group: {
              _id: "$orderStatus",
              count: {
                $sum: 1,
              },
            },
          },
        ]);

      const orderStatus = {
        Placed: 0,
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
      };

      orderStatusResult.forEach((item) => {
        if (
          Object.prototype.hasOwnProperty.call(
            orderStatus,
            item._id
          )
        ) {
          orderStatus[item._id] =
            item.count;
        }
      });

      // -----------------------------
      // LOW STOCK PRODUCTS
      // -----------------------------
      const lowStockProducts =
        await Product.find({
          stock: {
            $gt: 0,
            $lte: 5,
          },
        })
          .sort({
            stock: 1,
          })
          .limit(8);

      // -----------------------------
      // OUT OF STOCK PRODUCTS
      // -----------------------------
      const outOfStockProducts =
        await Product.countDocuments({
          stock: {
            $lte: 0,
          },
        });

      // -----------------------------
      // RECENT ORDERS
      // -----------------------------
      const recentOrders =
        await Order.find()
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(5);

      // -----------------------------
      // RESPONSE
      // -----------------------------
      res.status(200).json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        orderStatus,
        lowStockProducts,
        outOfStockProducts,
        recentOrders,
      });
    } catch (error) {
      console.error(
        "Dashboard stats error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load dashboard data.",
      });
    }
  }
);

module.exports = router;