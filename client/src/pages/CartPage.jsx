import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { useCart } from "../context/CartContext";

import "../styles/CartPage.css";

function CartPage() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const shipping =
    cartTotal >= 2000 || cartTotal === 0
      ? 0
      : 99;

  const grandTotal = cartTotal + shipping;

  /*
    EMPTY CART
  */
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">

          <div className="empty-cart-icon">
            <ShoppingBag size={45} />
          </div>

          <span className="cart-label">
            SHOPPING BAG
          </span>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Looks like you haven't added anything
            to your cart yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping-btn"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-container">

        {/* =========================
            HEADER
        ========================== */}

        <div className="cart-header">

          <span className="cart-label">
            YOUR SHOPPING BAG
          </span>

          <h1>
            Shopping Cart
          </h1>

          <p>
            Review your items before proceeding
            to checkout.
          </p>

        </div>

        {/* =========================
            CART LAYOUT
        ========================== */}

        <div className="cart-layout">

          {/* =========================
              CART ITEMS
          ========================== */}

          <div className="cart-items">

            <div className="cart-items-header">

              <h2>
                Cart Items ({cartItems.length})
              </h2>

            </div>

            {cartItems.map((item) => (
              <div
                className="cart-item"
                key={item._id}
              >

                {/* PRODUCT IMAGE */}

                <div className="cart-item-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>

                {/* PRODUCT DETAILS */}

                <div className="cart-item-details">

                  <span className="cart-item-category">
                    {item.category}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p className="cart-item-price">
                    ₹
                    {item.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  {/* STOCK */}

                  <p className="cart-stock">

                    {item.stock > 0
                      ? `${item.stock} available`
                      : "Out of stock"}

                  </p>

                  {/* QUANTITY */}

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item._id
                        )
                      }
                      disabled={
                        item.quantity <= 1
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} />
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item._id
                        )
                      }
                      disabled={
                        item.quantity >=
                        item.stock
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                  {/* STOCK LIMIT MESSAGE */}

                  {item.stock > 0 &&
                    item.quantity >=
                      item.stock && (
                      <p className="stock-limit-message">
                        Maximum available quantity
                        reached.
                      </p>
                    )}

                </div>

                {/* ITEM ACTIONS */}

                <div className="cart-item-actions">

                  <strong>
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </strong>

                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() =>
                      removeFromCart(item._id)
                    }
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* =========================
              ORDER SUMMARY
          ========================== */}

          <aside className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {cartTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Shipping
              </span>

              <strong>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}
              </strong>

            </div>

            {/* FREE SHIPPING MESSAGE */}

            {shipping === 0 &&
              cartTotal > 0 && (
                <p className="free-shipping-message">
                  🎉 You got free shipping!
                </p>
              )}

            {/* SHIPPING PROGRESS */}

            {cartTotal > 0 &&
              cartTotal < 2000 && (
                <p className="shipping-progress">
                  Add ₹
                  {(2000 - cartTotal).toLocaleString(
                    "en-IN"
                  )}{" "}
                  more to get free shipping.
                </p>
              )}

            <div className="summary-divider" />

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {grandTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* CHECKOUT */}

            <button
              type="button"
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>

            <Link
              to="/products"
              className="continue-shopping-link"
            >
              Continue Shopping
            </Link>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default CartPage;