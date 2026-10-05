const express = require("express");

const Product = require("../models/Product");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================================
GET ALL PRODUCTS
CLIENT + ADMIN
==================================================
*/

router.get("/", async (req, res) => {
  try {
    const products =
      await Product.find().sort({
        createdAt: -1,
      });

    res.status(200).json(products);
  } catch (error) {
    console.error(
      "Fetch products error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch products.",
      error: error.message,
    });
  }
});

/*
==================================================
GET SINGLE PRODUCT
CLIENT
==================================================
*/

router.get("/:id", async (req, res) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(
      "Fetch product error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch product.",
      error: error.message,
    });
  }
});

/*
==================================================
CREATE PRODUCT
ADMIN ONLY
==================================================
*/

router.post(
  "/admin",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const {
        name,
        description,
        category,
        price,
        originalPrice,
        discount,
        image,
        rating,
        stock,
        featured,
      } = req.body;

      /*
      ----------------------------------------------
      VALIDATION
      ----------------------------------------------
      */

      if (
        !name ||
        !description ||
        !category ||
        price === undefined ||
        !image
      ) {
        return res.status(400).json({
          message:
            "Name, description, category, price and image are required.",
        });
      }

      if (
        Number(price) < 0 ||
        Number(stock || 0) < 0
      ) {
        return res.status(400).json({
          message:
            "Price and stock cannot be negative.",
        });
      }

      /*
      ----------------------------------------------
      CREATE PRODUCT
      ----------------------------------------------
      */

      const product =
        await Product.create({
          name: name.trim(),

          description:
            description.trim(),

          category:
            category.trim(),

          price: Number(price),

          originalPrice:
            Number(originalPrice) || 0,

          discount:
            Number(discount) || 0,

          image: image.trim(),

          rating:
            Number(rating) || 0,

          stock:
            Number(stock) || 0,

          featured:
            Boolean(featured),
        });

      res.status(201).json({
        message:
          "Product created successfully.",

        product,
      });
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create product.",

        error: error.message,
      });
    }
  }
);

/*
==================================================
UPDATE PRODUCT
ADMIN ONLY
==================================================
*/

router.put(
  "/admin/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const {
        name,
        description,
        category,
        price,
        originalPrice,
        discount,
        image,
        rating,
        stock,
        featured,
      } = req.body;

      /*
      ----------------------------------------------
      FIND PRODUCT
      ----------------------------------------------
      */

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found.",
        });
      }

      /*
      ----------------------------------------------
      VALIDATION
      ----------------------------------------------
      */

      if (
        !name ||
        !description ||
        !category ||
        price === undefined ||
        !image
      ) {
        return res.status(400).json({
          message:
            "Name, description, category, price and image are required.",
        });
      }

      if (
        Number(price) < 0 ||
        Number(stock || 0) < 0
      ) {
        return res.status(400).json({
          message:
            "Price and stock cannot be negative.",
        });
      }

      /*
      ----------------------------------------------
      UPDATE
      ----------------------------------------------
      */

      product.name =
        name.trim();

      product.description =
        description.trim();

      product.category =
        category.trim();

      product.price =
        Number(price);

      product.originalPrice =
        Number(originalPrice) || 0;

      product.discount =
        Number(discount) || 0;

      product.image =
        image.trim();

      product.rating =
        Number(rating) || 0;

      product.stock =
        Number(stock) || 0;

      product.featured =
        Boolean(featured);

      await product.save();

      res.status(200).json({
        message:
          "Product updated successfully.",

        product,
      });
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update product.",

        error: error.message,
      });
    }
  }
);

/*
==================================================
DELETE PRODUCT
ADMIN ONLY
==================================================
*/

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found.",
        });
      }

      await Product.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        message:
          "Product deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete product.",

        error: error.message,
      });
    }
  }
);

module.exports = router;