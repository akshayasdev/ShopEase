import { useState } from "react";

import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { useCart } from "../context/CartContext";

import "../styles/CheckoutPage.css";

function CheckoutPage() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  /* =================================
     AUTHENTICATION
  ================================= */

  const token = localStorage.getItem(
    "shopeaseToken"
  );

  const storedUser = localStorage.getItem(
    "shopeaseUser"
  );

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  /* =================================
     FORM DATA
  ================================= */

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* =================================
     PAYMENT
  ================================= */

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  /* =================================
     LOADING / ERROR
  ================================= */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =================================
     SHIPPING
  ================================= */

  const shipping =
    cartTotal >= 2000 ? 0 : 99;

  const total =
    cartTotal + shipping;

  /* =================================
     FORM CHANGE
  ================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =================================
     PLACE ORDER
  ================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    /* ================================
       CHECK LOGIN
    ================================= */

    if (!token) {
      navigate("/login");
      return;
    }

    /* ================================
       CHECK EMPTY CART
    ================================= */

    if (cartItems.length === 0) {
      setError(
        "Your cart is empty."
      );

      return;
    }

    setLoading(true);

    try {
      /* ================================
         STEP 1:
         CHECK LATEST STOCK
      ================================= */

      for (const item of cartItems) {
        try {
          const response =
            await axios.get(
              `http://localhost:5000/api/products/${item._id}`
            );

          const latestProduct =
            response.data;

          /* ================================
             PRODUCT NO LONGER EXISTS
          ================================= */

          if (!latestProduct) {
            setError(
              `${item.name} is no longer available.`
            );

            setLoading(false);
            return;
          }

          /* ================================
             CHECK STOCK
          ================================= */

          if (
            latestProduct.stock <
            item.quantity
          ) {
            if (
              latestProduct.stock === 0
            ) {
              setError(
                `${latestProduct.name} is out of stock. Please remove it from your cart.`
              );
            } else {
              setError(
                `${latestProduct.name} has only ${latestProduct.stock} item(s) available, but your cart contains ${item.quantity}. Please update your cart quantity.`
              );
            }

            setLoading(false);
            return;
          }
        } catch (stockError) {
          console.error(
            "Stock verification error:",
            stockError
          );

          setError(
            `Unable to verify stock for ${item.name}. Please try again.`
          );

          setLoading(false);
          return;
        }
      }

      /* ================================
         STEP 2:
         PREPARE ORDER ITEMS
      ================================= */

      const orderItems =
        cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        }));

      /* ================================
         STEP 3:
         CREATE ORDER
      ================================= */

      const response =
        await axios.post(
          "http://localhost:5000/api/orders",
          {
            items: orderItems,

            shippingAddress:
              formData,

            subtotal:
              cartTotal,

            shipping:
              shipping,

            total:
              total,

            paymentMethod:
              paymentMethod,

            paymentStatus:
              paymentMethod === "COD"
                ? "Pending"
                : "Pending",
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      /* ================================
         STEP 4:
         GET ORDER ID
      ================================= */

      const orderId =
        response.data.order._id;

      /* ================================
         STEP 5:
         CLEAR CART
      ================================= */

      clearCart();

      /* ================================
         STEP 6:
         GO TO SUCCESS PAGE
      ================================= */

      navigate(
        `/order-success/${orderId}`
      );

    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      /* ================================
         BACKEND STOCK ERROR
      ================================= */

      if (
        error.response?.status === 400 ||
        error.response?.status === 404
      ) {
        setError(
          error.response?.data?.message ||
            "The product stock has changed. Please check your cart and try again."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to place your order. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =================================
     EMPTY CART
  ================================= */

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">

        <div className="checkout-empty">

          <CheckCircle size={50} />

          <h1>
            Your cart is empty
          </h1>

          <p>
            Add some products before
            proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="checkout-shop-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* =========================
            HEADER
        ========================== */}

        <div className="checkout-header">

          <Link
            to="/cart"
            className="checkout-back"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>

          <span className="checkout-label">
            SECURE CHECKOUT
          </span>

          <h1>
            Complete Your Order
          </h1>

          <p>
            Enter your delivery details
            and place your order.
          </p>

        </div>

        {/* =========================
            ERROR MESSAGE
        ========================== */}

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <div className="checkout-layout">

          {/* =========================
              CHECKOUT FORM
          ========================== */}

          <div className="checkout-form-section">

            <form
              onSubmit={handleSubmit}
            >

              {/* =========================
                  DELIVERY INFORMATION
              ========================== */}

              <section className="checkout-card">

                <div className="checkout-card-header">

                  <div className="checkout-card-icon">
                    <MapPin size={20} />
                  </div>

                  <div>

                    <h2>
                      Delivery Information
                    </h2>

                    <p>
                      Where should we
                      deliver your order?
                    </p>

                  </div>

                </div>

                <div className="checkout-fields">

                  {/* FULL NAME */}

                  <div className="checkout-field full-width">

                    <label htmlFor="fullName">
                      Full Name
                    </label>

                    <div className="checkout-input">

                      <User size={18} />

                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={
                          formData.fullName
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                  </div>

                  {/* PHONE */}

                  <div className="checkout-field">

                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <div className="checkout-input">

                      <Phone size={18} />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={
                          formData.phone
                        }
                        onChange={
                          handleChange
                        }
                        required
                        pattern="[0-9]{10}"
                      />

                    </div>

                  </div>

                  {/* PINCODE */}

                  <div className="checkout-field">

                    <label htmlFor="pincode">
                      Pincode
                    </label>

                    <div className="checkout-input">

                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        placeholder="6-digit pincode"
                        value={
                          formData.pincode
                        }
                        onChange={
                          handleChange
                        }
                        required
                        pattern="[0-9]{6}"
                      />

                    </div>

                  </div>

                  {/* ADDRESS */}

                  <div className="checkout-field full-width">

                    <label htmlFor="address">
                      Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      placeholder="House number, street, area"
                      value={
                        formData.address
                      }
                      onChange={
                        handleChange
                      }
                      required
                      rows="4"
                    />

                  </div>

                  {/* CITY */}

                  <div className="checkout-field">

                    <label htmlFor="city">
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Enter city"
                      value={
                        formData.city
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                  {/* STATE */}

                  <div className="checkout-field">

                    <label htmlFor="state">
                      State
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="Enter state"
                      value={
                        formData.state
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>

              </section>

              {/* =========================
                  PAYMENT METHOD
              ========================== */}

              <section className="checkout-card">

                <div className="checkout-card-header">

                  <div className="checkout-card-icon">
                    ₹
                  </div>

                  <div>

                    <h2>
                      Payment Method
                    </h2>

                    <p>
                      Choose how you want
                      to pay.
                    </p>

                  </div>

                </div>

                <div className="payment-options">

                  {/* COD */}

                  <label
                    className={`payment-option ${
                      paymentMethod === "COD"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={
                        paymentMethod ===
                        "COD"
                      }
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value
                        )
                      }
                    />

                    <div>

                      <strong>
                        Cash on Delivery
                      </strong>

                      <span>
                        Pay when your order
                        arrives
                      </span>

                    </div>

                  </label>

                  {/* ONLINE PAYMENT */}

                  <label
                    className={`payment-option ${
                      paymentMethod ===
                      "ONLINE"
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={
                        paymentMethod ===
                        "ONLINE"
                      }
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value
                        )
                      }
                    />

                    <div>

                      <strong>
                        Online Payment
                      </strong>

                      <span>
                        Online payment will be
                        available soon
                      </span>

                    </div>

                  </label>

                </div>

              </section>

              {/* =========================
                  PLACE ORDER
              ========================== */}

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading}
              >
                {loading
                  ? "Checking Stock & Placing Order..."
                  : `Place Order • ₹${total.toLocaleString(
                      "en-IN"
                    )}`}
              </button>

            </form>

          </div>

          {/* =========================
              ORDER SUMMARY
          ========================== */}

          <aside className="checkout-summary">

            <div className="checkout-summary-card">

              <h2>
                Order Summary
              </h2>

              <div className="checkout-products">

                {cartItems.map(
                  (item) => (
                    <div
                      className="checkout-product"
                      key={item._id}
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div>

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          Qty:{" "}
                          {item.quantity}
                        </p>

                        <strong>
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>
                  )
                )}

              </div>

              <div className="summary-divider" />

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

              <div className="summary-divider" />

              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default CheckoutPage;