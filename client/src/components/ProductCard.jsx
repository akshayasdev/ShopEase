import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const inWishlist = isInWishlist(product._id);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    addToCart(product);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <article className="product-card">
      <div className="product-image-wrapper">

        {/* DISCOUNT */}
        {product.discount > 0 && (
          <span className="discount-badge">
            -{product.discount}%
          </span>
        )}

        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <span className="out-of-stock-badge">
            Out of Stock
          </span>
        )}

        {/* WISHLIST */}
        <button
          className={`wishlist-btn ${
            inWishlist ? "wishlist-active" : ""
          }`}
          aria-label={
            inWishlist
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={handleWishlist}
        >
          <Heart
            size={19}
            fill={
              inWishlist
                ? "currentColor"
                : "none"
            }
          />
        </button>

        {/* PRODUCT IMAGE */}
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </Link>
      </div>

      <div className="product-content">

        {/* CATEGORY */}
        <span className="product-category">
          {product.category}
        </span>

        {/* PRODUCT NAME */}
        <Link
          to={`/products/${product._id}`}
          className="product-name-link"
        >
          <h3 className="product-name">
            {product.name}
          </h3>
        </Link>

        {/* RATING */}
        <div className="product-rating">
          <Star
            size={16}
            fill="currentColor"
          />

          <span>{product.rating}</span>
        </div>

        {/* STOCK */}
        <div className="product-stock">
          {isOutOfStock ? (
            <span className="stock-out">
              Out of stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="stock-low">
              Only {product.stock} left
            </span>
          ) : (
            <span className="stock-available">
              {product.stock} in stock
            </span>
          )}
        </div>

        {/* PRICE + CART */}
        <div className="product-bottom">

          <div className="product-price">

            <span className="current-price">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {product.originalPrice > product.price && (
              <span className="original-price">
                ₹
                {product.originalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}

          </div>

          <button
            className={`add-cart-btn ${
              isOutOfStock
                ? "add-cart-disabled"
                : ""
            }`}
            aria-label={
              isOutOfStock
                ? `${product.name} is out of stock`
                : `Add ${product.name} to cart`
            }
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={18} />
          </button>

        </div>
      </div>
    </article>
  );
}

export default ProductCard;