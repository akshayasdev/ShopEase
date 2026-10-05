const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

/* =========================================
   ADMIN REGISTER
========================================= */

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "An account with this email already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log(
      "Admin account created:",
      admin.email
    );

    const token = jwt.sign(
      {
        userId: admin._id.toString(),
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message:
        "Admin account created successfully.",

      token,

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "Admin registration error:",
      error
    );

    res.status(500).json({
      message:
        "Admin registration failed.",
      error: error.message,
    });
  }
});

/* =========================================
   ADMIN LOGIN
========================================= */

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    console.log(
      "Admin login attempt:",
      normalizedEmail
    );

    const admin =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!admin) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    console.log(
      "Admin account found:",
      admin.email
    );

    console.log(
      "Role from database:",
      admin.role
    );

    /* =====================================
       CHECK ADMIN ROLE
    ===================================== */

    if (admin.role !== "admin") {
      return res.status(403).json({
        message:
          "This account is not an admin account.",
      });
    }

    /* =====================================
       CHECK PASSWORD
    ===================================== */

    const isPasswordValid =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    /* =====================================
       CREATE ADMIN TOKEN
    ===================================== */

    const token = jwt.sign(
      {
        userId: admin._id.toString(),
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const responseUser = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: "admin",
    };

    console.log(
      "Admin login successful:",
      responseUser
    );

    res.status(200).json({
      message:
        "Admin login successful.",

      token,

      user: responseUser,
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    res.status(500).json({
      message:
        "Admin login failed.",
      error: error.message,
    });
  }
});

module.exports = router;