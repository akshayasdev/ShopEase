import {
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import "../styles/WishlistPage.css";

function WishlistPage() {
  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-empty">

          <div className="wishlist-empty-icon">
            <Heart size={42} />
          </div>

          <span className="wishlist-label">
            YOUR WISHLIST
          </span>

          <h1>Your wishlist is empty</h1>

          <p>
            Save products you love here and
            come back to them whenever you want.
          </p>

          <Link
            to="/products"
            className="wishlist-shop-btn"
          >
            Start Shopping
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">

      <div className="wishlist-container">

        <div className="wishlist-header">

          <div>
            <span className="wishlist-label">
              SAVED FOR LATER
            </span>

            <h1>My Wishlist</h1>

            <p>
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1
                ? "product"
                : "products"}{" "}
              saved
            </p>
          </div>

        </div>

        <div className="wishlist-grid">

          {wishlistItems.map((product) => (
            <article
              className="wishlist-card"
              key={product._id}
            >

              <div className="wishlist-image-wrapper">

                {product.discount > 0 && (
                  <span className="wishlist-discount">
                    -{product.discount}%
                  </span>
                )}

                <Link
                  to={`/products/${product._id}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="wishlist-image"
                  />
                </Link>

              </div>

              <div className="wishlist-content">

                <span className="wishlist-category">
                  {product.category}
                </span>

                <Link
                  to={`/products/${product._id}`}
                  className="wishlist-name"
                >
                  {product.name}
                </Link>

                <div className="wishlist-price">
                  ₹
                  {product.price.toLocaleString(
                    "en-IN"
                  )}

                  {product.originalPrice >
                    product.price && (
                    <span>
                      ₹
                      {product.originalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  )}
                </div>

                <div className="wishlist-actions">

                  <button
                    className="wishlist-cart-btn"
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    <ShoppingCart size={17} />
                    Add to Cart
                  </button>

                  <button
                    className="wishlist-remove-btn"
                    onClick={() =>
                      removeFromWishlist(
                        product._id
                      )
                    }
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>

            </article>
          ))}

        </div>

      </div>

    </main>
  );
}

export default WishlistPage;