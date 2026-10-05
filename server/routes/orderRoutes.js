const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* =================================
   CREATE ORDER
   POST /api/orders

   Also reduces product stock
================================= */

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const {
        items,
        shippingAddress,
        subtotal,
        shipping,
        total,
        paymentMethod,
        paymentStatus,
      } = req.body;

      /* ================================
         VALIDATE ORDER ITEMS
      ================================= */

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: "Order items are required.",
        });
      }

      /* ================================
         VALIDATE EACH ITEM
      ================================= */

      for (const item of items) {
        if (
          !item.product ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
        ) {
          return res.status(400).json({
            message: "Invalid order item or quantity.",
          });
        }
      }

      /* ================================
         CHECK ALL PRODUCTS AND STOCK
      ================================= */

      for (const item of items) {
        const product = await Product.findById(
          item.product
        );

        if (!product) {
          return res.status(404).json({
            message: `Product not found: ${
              item.name || item.product
            }`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `${product.name} has only ${product.stock} item(s) in stock.`,
          });
        }
      }

      /* ================================
         REDUCE PRODUCT STOCK SAFELY

         Stock is reduced only when the
         database still has enough stock.
      ================================= */

      const updatedProducts = [];

      for (const item of items) {
        const updatedProduct =
          await Product.findOneAndUpdate(
            {
              _id: item.product,
              stock: {
                $gte: item.quantity,
              },
            },
            {
              $inc: {
                stock: -item.quantity,
              },
            },
            {
              new: true,
            }
          );

        /* ================================
           STOCK CHANGED BEFORE ORDER
           COULD BE COMPLETED
        ================================= */

        if (!updatedProduct) {
          /* Restore stock already reduced */
          for (const previousItem of updatedProducts) {
            await Product.findByIdAndUpdate(
              previousItem.productId,
              {
                $inc: {
                  stock: previousItem.quantity,
                },
              }
            );
          }

          const latestProduct =
            await Product.findById(
              item.product
            );

          if (!latestProduct) {
            return res.status(404).json({
              message: `Product not found: ${
                item.name || item.product
              }`,
            });
          }

          return res.status(400).json({
            message: `${latestProduct.name} no longer has enough stock. Available stock: ${latestProduct.stock}.`,
          });
        }

        updatedProducts.push({
          productId: item.product,
          quantity: item.quantity,
        });
      }

      /* ================================
         CREATE ORDER
      ================================= */

      let order;

      try {
        order = await Order.create({
          user: req.user.userId,
          items,
          shippingAddress,
          subtotal,
          shipping,
          total,
          paymentMethod:
            paymentMethod || "COD",
          paymentStatus:
            paymentStatus || "Pending",
          orderStatus: "Placed",
        });
      } catch (orderError) {
        /* ================================
           ORDER CREATION FAILED

           Restore all deducted stock.
        ================================= */

        for (const item of updatedProducts) {
          await Product.findByIdAndUpdate(
            item.productId,
            {
              $inc: {
                stock: item.quantity,
              },
            }
          );
        }

        throw orderError;
      }

      /* ================================
         SUCCESS RESPONSE
      ================================= */

      res.status(201).json({
        message: "Order placed successfully.",
        order,
      });
    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      res.status(500).json({
        message: "Failed to create order.",
        error: error.message,
      });
    }
  }
);

/* =================================
   GET MY ORDERS
   GET /api/orders/my-orders
================================= */

router.get(
  "/my-orders",
  protect,
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          user: req.user.userId,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json(orders);
    } catch (error) {
      console.error(
        "Get my orders error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load your orders.",
      });
    }
  }
);

/* =================================
   GET SINGLE ORDER
   GET /api/orders/:id
================================= */

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message: "Order not found.",
        });
      }

      /* ================================
         CUSTOMER CAN ONLY VIEW
         THEIR OWN ORDER

         ADMIN CAN VIEW ANY ORDER
      ================================= */

      if (
        order.user.toString() !==
          req.user.userId &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to view this order.",
        });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error(
        "Get order error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load order.",
      });
    }
  }
);

/* =================================
   UPDATE ORDER STATUS
   PUT /api/orders/:id/status

   ADMIN ONLY
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
          message: "Order not found.",
        });
      }

      order.orderStatus =
        orderStatus;

      await order.save();

      res.status(200).json({
        message:
          "Order status updated successfully.",
        order,
      });
    } catch (error) {
      console.error(
        "Update order status error:",
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