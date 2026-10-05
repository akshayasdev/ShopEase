import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import axios from "axios";

import { useCart } from "../context/CartContext";

import "../styles/ProductDetails.css";

function ProductDetailsPage() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        setProduct(response.data);
      } catch (error) {
        console.error(
          "Error fetching product:",
          error
        );

        setError(
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================================
     INCREASE QUANTITY
  ================================= */

  const handleIncrease = () => {
    if (!product) return;

    if (quantity < product.stock) {
      setQuantity(
        (current) => current + 1
      );
    }
  };

  /* ================================
     DECREASE QUANTITY
  ================================= */

  const handleDecrease = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  /* ================================
     ADD TO CART
  ================================= */

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    /*
      Add the selected quantity.
    */
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">
          <h2>Loading Product...</h2>

          <p>
            Please wait while we fetch the
            product details.
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">

          <h2>Product Not Found</h2>

          <p>
            {error ||
              "This product does not exist."}
          </p>

          <Link
            to="/products"
            className="back-products-btn"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>

        </div>
      </main>
    );
  }

  const isOutOfStock =
    product.stock <= 0;

  const maximumQuantityReached =
    quantity >= product.stock;

  return (
    <main className="product-details-page">

      <div className="product-details-container">

        {/* BACK LINK */}

        <Link
          to="/products"
          className="back-products-link"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <div className="product-details-layout">

          {/* PRODUCT IMAGE */}

          <div className="product-details-image-wrapper">

            {product.discount > 0 && (
              <span className="details-discount">
                -{product.discount}%
              </span>
            )}

            {isOutOfStock && (
              <span className="details-out-of-stock">
                Out of Stock
              </span>
            )}

            <img
              src={product.image}
              alt={product.name}
              className="product-details-image"
            />

          </div>

          {/* PRODUCT INFORMATION */}

          <div className="product-details-info">

            <span className="details-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            {/* RATING */}

            <div className="details-rating">

              <div className="stars">

                <Star
                  size={18}
                  fill="currentColor"
                />

                <span>
                  {product.rating}
                </span>

              </div>

              <span className="rating-text">
                Customer Rating
              </span>

            </div>

            {/* PRICE */}

            <div className="details-price">

              <span className="details-current-price">
                ₹
                {product.price.toLocaleString(
                  "en-IN"
                )}
              </span>

              {product.originalPrice >
                product.price && (
                <span className="details-original-price">
                  ₹
                  {product.originalPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              )}

              {product.discount > 0 && (
                <span className="details-save">
                  Save {product.discount}%
                </span>
              )}

            </div>

            {/* DESCRIPTION */}

            <div className="details-description">

              <h3>
                Product Description
              </h3>

              <p>
                {product.description}
              </p>

            </div>

            {/* STOCK */}

            <div className="stock-status">

              <span
                className={
                  product.stock > 0
                    ? "in-stock"
                    : "out-of-stock"
                }
              >
                {product.stock > 0
                  ? `✓ In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>

            </div>

            {/* QUANTITY + CART */}

            {product.stock > 0 && (
              <div className="details-actions">

                {/* QUANTITY */}

                <div className="details-quantity">

                  <button
                    onClick={
                      handleDecrease
                    }
                    disabled={
                      quantity <= 1
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={17} />
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    onClick={
                      handleIncrease
                    }
                    disabled={
                      maximumQuantityReached
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={17} />
                  </button>

                </div>

                {/* ADD TO CART */}

                <button
                  className="details-add-cart"
                  onClick={
                    handleAddToCart
                  }
                  disabled={isOutOfStock}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

              </div>
            )}

            {/* TOTAL */}

            {product.stock > 0 && (
              <div className="details-total">

                Total:

                <strong>
                  ₹
                  {(
                    product.price *
                    quantity
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;