import { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/MyOrdersPage.css";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem(
          "shopeaseToken"
        );

        if (!token) {
          setError(
            "Please login to view your orders."
          );
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="my-orders-page">
        <div className="orders-loading">
          <div className="orders-spinner"></div>

          <h2>Loading your orders...</h2>

          <p>Please wait a moment.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-orders-page">
        <div className="orders-error">
          <Package size={50} />

          <h1>Unable to load orders</h1>

          <p>{error}</p>

          <Link
            to="/login"
            className="orders-primary-btn"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="my-orders-page">
        <div className="orders-empty">
          <div className="orders-empty-icon">
            <ShoppingBag size={45} />
          </div>

          <span className="orders-label">
            YOUR ORDERS
          </span>

          <h1>No Orders Yet</h1>

          <p>
            You haven't placed any orders yet.
            Start shopping and your orders will
            appear here.
          </p>

          <Link
            to="/products"
            className="orders-primary-btn"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="my-orders-page">
      <div className="my-orders-container">

        <div className="orders-header">
          <span className="orders-label">
            YOUR SHOPPING ACTIVITY
          </span>

          <h1>My Orders</h1>

          <p>
            Track and view all your ShopEase orders.
          </p>
        </div>

        <div className="orders-list">

          {orders.map((order) => (
            <article
              className="order-card"
              key={order._id}
            >

              <div className="order-card-header">

                <div>
                  <span className="order-card-label">
                    ORDER ID
                  </span>

                  <h2>
                    #
                    {order._id
                      .slice(-8)
                      .toUpperCase()}
                  </h2>
                </div>

                <span
                  className={`order-status-badge ${order.orderStatus
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {order.orderStatus}
                </span>

              </div>

              <div className="order-card-body">

                <div className="order-card-items">

                  {order.items.map((item) => (
                    <div
                      className="order-card-item"
                      key={`${order._id}-${item.product}`}
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="order-card-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          Quantity: {item.quantity}
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
                  ))}

                </div>

              </div>

              <div className="order-card-footer">

                <div>
                  <span>
                    Payment
                  </span>

                  <strong>
                    {order.paymentMethod ===
                    "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </strong>
                </div>

                <div>
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

                <Link
                  to={`/order-success/${order._id}`}
                  className="view-order-btn"
                >
                  View Order
                  <ArrowRight size={17} />
                </Link>

              </div>

            </article>
          ))}

        </div>

      </div>
    </main>
  );
}

export default MyOrdersPage;