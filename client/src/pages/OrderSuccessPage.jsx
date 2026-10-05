import { useEffect, useState } from "react";
import {
  CheckCircle,
  Package,
  ShoppingBag,
  MapPin,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import "../styles/OrderSuccessPage.css";

function OrderSuccessPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem(
          "shopeaseToken"
        );

        if (!token) {
          setError(
            "Please login to view your order."
          );
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data);
      } catch (error) {
        console.error(
          "Error fetching order:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /*
  ================================================
  LOADING
  ================================================
  */

  if (loading) {
    return (
      <main className="order-success-page">
        <div className="order-loading">
          <div className="order-spinner"></div>

          <h2>
            Loading your order...
          </h2>

          <p>
            Please wait a moment.
          </p>
        </div>
      </main>
    );
  }

  /*
  ================================================
  ERROR
  ================================================
  */

  if (error || !order) {
    return (
      <main className="order-success-page">
        <div className="order-error">

          <Package size={48} />

          <h1>
            Order not found
          </h1>

          <p>
            {error ||
              "We couldn't find this order."}
          </p>

          <Link
            to="/products"
            className="order-success-btn"
          >
            Continue Shopping
          </Link>

        </div>
      </main>
    );
  }

  /*
  ================================================
  ORDER TRACKING
  ================================================
  */

  const trackingSteps = [
    {
      status: "Placed",
      label: "Order Placed",
      description:
        "Your order has been received.",
      icon: CheckCircle,
    },

    {
      status: "Processing",
      label: "Processing",
      description:
        "We're preparing your order.",
      icon: Package,
    },

    {
      status: "Shipped",
      label: "Shipped",
      description:
        "Your order is on its way.",
      icon: Truck,
    },

    {
      status: "Delivered",
      label: "Delivered",
      description:
        "Your order has been delivered.",
      icon: CheckCircle,
    },
  ];

  const statusIndex =
    trackingSteps.findIndex(
      (step) =>
        step.status === order.orderStatus
    );

  const currentStatusIndex =
    statusIndex === -1 ? 0 : statusIndex;

  /*
  ================================================
  MAIN
  ================================================
  */

  return (
    <main className="order-success-page">

      <div className="order-success-container">

        {/* =================================
            SUCCESS HEADER
        ================================= */}

        <div className="order-success-header">

          <div className="success-icon">
            <CheckCircle size={54} />
          </div>

          <span className="success-label">
            ORDER CONFIRMED
          </span>

          <h1>
            Thank you for your order!
          </h1>

          <p>
            Your order has been placed
            successfully. We'll get it ready
            for delivery.
          </p>

        </div>

        {/* =================================
            ORDER INFORMATION
        ================================= */}

        <div className="order-info-card">

          <div className="order-info-item">

            <span>
              Order ID
            </span>

            <strong>
              #
              {order._id
                .slice(-8)
                .toUpperCase()}
            </strong>

          </div>

          <div className="order-info-item">

            <span>
              Order Status
            </span>

            <strong className="order-status">
              {order.orderStatus}
            </strong>

          </div>

          <div className="order-info-item">

            <span>
              Payment
            </span>

            <strong>
              Cash on Delivery
            </strong>

          </div>

          <div className="order-info-item">

            <span>
              Total Amount
            </span>

            <strong>
              ₹
              {order.total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

        {/* =================================
            ORDER TRACKING
        ================================= */}

        {order.orderStatus !==
          "Cancelled" && (
          <section className="tracking-section">

            <div className="tracking-header">

              <div>

                <span className="success-section-label">
                  ORDER TRACKING
                </span>

                <h2>
                  Delivery Progress
                </h2>

              </div>

              <MapPin size={24} />

            </div>

            <div className="tracking-timeline">

              {trackingSteps.map(
                (step, index) => {
                  const Icon = step.icon;

                  const completed =
                    index <=
                    currentStatusIndex;

                  const active =
                    index ===
                    currentStatusIndex;

                  return (
                    <div
                      className={`tracking-step ${
                        completed
                          ? "completed"
                          : ""
                      } ${
                        active
                          ? "active"
                          : ""
                      }`}
                      key={step.status}
                    >

                      <div className="tracking-icon">
                        <Icon size={19} />
                      </div>

                      <div className="tracking-content">

                        <strong>
                          {step.label}
                        </strong>

                        <span>
                          {step.description}
                        </span>

                      </div>

                      {index <
                        trackingSteps.length -
                          1 && (
                        <div
                          className={`tracking-line ${
                            index <
                            currentStatusIndex
                              ? "completed"
                              : ""
                          }`}
                        />
                      )}

                    </div>
                  );
                }
              )}

            </div>

          </section>
        )}

        {/* =================================
            CANCELLED
        ================================= */}

        {order.orderStatus ===
          "Cancelled" && (
          <section className="tracking-section cancelled-tracking">

            <div className="tracking-header">

              <div>

                <span className="success-section-label">
                  ORDER STATUS
                </span>

                <h2>
                  Order Cancelled
                </h2>

              </div>

              <Package size={24} />

            </div>

            <p>
              This order has been cancelled.
            </p>

          </section>
        )}

        {/* =================================
            ORDER ITEMS
        ================================= */}

        <section className="success-section">

          <div className="success-section-header">

            <div>

              <span className="success-section-label">
                YOUR ORDER
              </span>

              <h2>
                Order Items
              </h2>

            </div>

            <ShoppingBag size={24} />

          </div>

          <div className="success-items">

            {order.items.map((item) => (
              <div
                className="success-item"
                key={item.product}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="success-item-info">

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Quantity: {item.quantity}
                  </p>

                </div>

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
            ))}

          </div>

        </section>

        {/* =================================
            DELIVERY ADDRESS
        ================================= */}

        <section className="success-section">

          <div className="success-section-header">

            <div>

              <span className="success-section-label">
                DELIVERY
              </span>

              <h2>
                Delivery Address
              </h2>

            </div>

          </div>

          <div className="delivery-address">

            <strong>
              {order.shippingAddress.fullName}
            </strong>

            <p>
              {order.shippingAddress.address}
            </p>

            <p>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>

            <p>
              Phone:{" "}
              {order.shippingAddress.phone}
            </p>

          </div>

        </section>

        {/* =================================
            SUMMARY
        ================================= */}

        <section className="success-summary">

          <div>

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {order.subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div>

            <span>
              Shipping
            </span>

            <strong>
              {order.shipping === 0
                ? "FREE"
                : `₹${order.shipping}`}
            </strong>

          </div>

          <div className="success-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {order.total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </section>

        {/* =================================
            ACTIONS
        ================================= */}

        <div className="order-success-actions">

          <Link
            to="/products"
            className="order-success-btn"
          >
            Continue Shopping
          </Link>

          <Link
            to="/orders"
            className="order-success-outline-btn"
          >
            View My Orders
          </Link>

        </div>

      </div>

    </main>
  );
}

export default OrderSuccessPage;