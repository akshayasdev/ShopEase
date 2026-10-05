const express = require("express");
const Order = require("../models/Order");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* =================================
   GET ALL ORDERS
   GET /api/admin/orders
================================= */

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

      res.status(200).json(orders);
    } catch (error) {
      console.error(
        "Get admin orders error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load orders.",
      });
    }
  }
);

/* =================================
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id/status
================================= */

router.put(
  "/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { orderStatus } =
        req.body;

      const allowedStatuses = [
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (
        !allowedStatuses.includes(
          orderStatus
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order status.",
        });
      }

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found.",
        });
      }

      order.orderStatus =
        orderStatus;

      await order.save();

      const updatedOrder =
        await Order.findById(
          order._id
        ).populate(
          "user",
          "name email"
        );

      res.status(200).json({
        message:
          "Order status updated successfully.",
        order: updatedOrder,
      });
    } catch (error) {
      console.error(
        "Update admin order status error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update order status.",
        error: error.message,
      });
    }
  }
);

module.exports = router;