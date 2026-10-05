const express = require("express");
const User = require("../models/User");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* ================================
   GET ALL USERS
   GET /api/admin/users
================================ */

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find(
        {},
        "-password"
      ).sort({
        createdAt: -1,
      });

      res.status(200).json(users);
    } catch (error) {
      console.error(
        "Get users error:",
        error
      );

      res.status(500).json({
        message: "Failed to load users.",
      });
    }
  }
);

module.exports = router;