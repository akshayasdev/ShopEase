import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  LogOut,
  Menu,
  X,
  Search,
  RefreshCw,
  User,
  Mail,
  MapPin,
  CalendarDays,
  ChevronDown,
  IndianRupee,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import "../styles/AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  /* ================================
     STATE
  ================================= */

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [updatingOrder, setUpdatingOrder] =
    useState(null);

  /* ================================
     ADMIN USER
  ================================= */

  let adminUser = null;

  try {
    adminUser = JSON.parse(
      localStorage.getItem(
        "shopeaseAdminUser"
      ) || "null"
    );
  } catch (error) {
    console.error(
      "Admin user parsing error:",
      error
    );

    adminUser = null;
  }

  /* ================================
     FETCH ALL ORDERS
  ================================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "shopeaseAdminToken"
        );

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response =
        await axios.get(
          "http://localhost:5000/api/admin/orders",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setOrders(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Admin orders error:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem(
          "shopeaseAdminToken"
        );

        localStorage.removeItem(
          "shopeaseAdminUser"
        );

        navigate("/admin/login");

        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     LOAD ORDERS
  ================================= */

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================================
     LOGOUT
  ================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "shopeaseAdminToken"
    );

    localStorage.removeItem(
      "shopeaseAdminUser"
    );

    navigate("/admin/login");
  };

  /* ================================
     UPDATE ORDER STATUS
  ================================= */

  const updateOrderStatus = async (
    orderId,
    orderStatus
  ) => {
    try {
      setUpdatingOrder(orderId);
      setError("");

      const token =
        localStorage.getItem(
          "shopeaseAdminToken"
        );

      if (!token) {
        navigate("/admin/login");
        return;
      }

      /*
        IMPORTANT:
        This is the ADMIN endpoint.

        The backticks are required so
        ${orderId} becomes the real ID.
      */

      const response =
        await axios.put(
          `http://localhost:5000/api/admin/orders/${orderId}/status`,
          {
            orderStatus,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      /*
        Use the updated order returned
        by the backend.
      */

      const updatedOrder =
        response.data?.order;

      if (updatedOrder) {
        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (order) =>
                order._id === orderId
                  ? updatedOrder
                  : order
            )
        );
      } else {
        /*
          Fallback in case backend does
          not return the updated order.
        */

        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (order) =>
                order._id === orderId
                  ? {
                      ...order,
                      orderStatus,
                    }
                  : order
            )
        );
      }
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem(
          "shopeaseAdminToken"
        );

        localStorage.removeItem(
          "shopeaseAdminUser"
        );

        navigate("/admin/login");

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  /* ================================
     SEARCH ORDERS
  ================================= */

  const filteredOrders =
    orders.filter((order) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      const orderId =
        order._id?.toLowerCase() ||
        "";

      const customerName =
        order.user?.name
          ?.toLowerCase() || "";

      const customerEmail =
        order.user?.email
          ?.toLowerCase() || "";

      const fullName =
        order.shippingAddress
          ?.fullName
          ?.toLowerCase() || "";

      return (
        orderId.includes(search) ||
        customerName.includes(search) ||
        customerEmail.includes(search) ||
        fullName.includes(search)
      );
    });

  /* ================================
     FORMAT DATE
  ================================= */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ================================
     FORMAT CURRENCY
  ================================= */

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount || 0);
  };

  /* ================================
     STATUS CLASS
  ================================= */

  const getStatusClass = (status) => {
    return `status-${status
      ?.toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  /* ================================
     RENDER
  ================================= */

  return (
    <div className="admin-orders-page">

      {/* ================================
          MOBILE HEADER
      ================================= */}

      <header className="admin-mobile-header">
        <button
          type="button"
          className="admin-menu-button"
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
        >
          {sidebarOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        <strong>
          ShopEase Admin
        </strong>
      </header>

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Package size={25} />
          </div>

          <div>
            <h2>ShopEase</h2>

            <span>
              ADMIN PANEL
            </span>
          </div>
        </div>

        <nav className="admin-navigation">

          <Link
            to="/admin"
            className="admin-nav-link"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <LayoutDashboard
              size={19}
            />

            <span>
              Dashboard
            </span>
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link active"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <ShoppingCart
              size={19}
            />

            <span>
              Orders
            </span>
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Package size={19} />

            <span>
              Products
            </span>
          </Link>

          <Link
            to="/admin/users"
            className="admin-nav-link"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Users size={19} />

            <span>
              Users
            </span>
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-user-info">

            <div className="admin-user-avatar">
              {adminUser?.name
                ? adminUser.name
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div className="admin-user-details">

              <strong>
                {adminUser?.name ||
                  "Administrator"}
              </strong>

              <span>
                {adminUser?.email ||
                  "Admin Account"}
              </span>

            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={
              handleLogout
            }
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </aside>

      {/* ================================
          OVERLAY
      ================================= */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="admin-orders-main">

        {/* ================================
            PAGE HEADER
        ================================= */}

        <div className="admin-orders-header">

          <div>
            <span className="admin-page-label">
              ORDER MANAGEMENT
            </span>

            <h1>
              Orders
            </h1>

            <p>
              View and manage customer
              orders from your store.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "refresh-spinning"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* ================================
            TOOLBAR
        ================================= */}

        <div className="admin-orders-toolbar">

          <div className="admin-orders-count">

            <strong>
              {filteredOrders.length}
            </strong>

            <span>
              {filteredOrders.length ===
              1
                ? "Order"
                : "Orders"}
            </span>

          </div>

          <div className="admin-orders-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search by order ID, name or email..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* ================================
            ERROR
        ================================= */}

        {error && (
          <div className="admin-orders-error">
            {error}
          </div>
        )}

        {/* ================================
            LOADING
        ================================= */}

        {loading ? (

          <div className="admin-orders-loading">

            <RefreshCw
              size={28}
              className="refresh-spinning"
            />

            <p>
              Loading orders...
            </p>

          </div>

        ) : filteredOrders.length ===
          0 ? (

          /* ================================
             EMPTY
          ================================= */

          <div className="admin-orders-empty">

            <div className="admin-orders-empty-icon">

              <ShoppingCart
                size={35}
              />

            </div>

            <h2>
              No orders found
            </h2>

            <p>
              {searchTerm
                ? "No orders match your search."
                : "Customer orders will appear here when they place an order."}
            </p>

          </div>

        ) : (

          /* ================================
             ORDER LIST
          ================================= */

          <div className="admin-orders-list">

            {filteredOrders.map(
              (order) => (

                <article
                  key={order._id}
                  className="admin-order-card"
                >

                  {/* ================================
                      ORDER HEADER
                  ================================= */}

                  <div className="admin-order-header">

                    <div>

                      <span>
                        ORDER ID
                      </span>

                      <strong>
                        #
                        {order._id
                          ?.slice(-8)
                          .toUpperCase()}
                      </strong>

                    </div>

                    <div className="admin-order-date">

                      <CalendarDays
                        size={15}
                      />

                      {formatDate(
                        order.createdAt
                      )}

                    </div>

                  </div>

                  {/* ================================
                      ORDER BODY
                  ================================= */}

                  <div className="admin-order-body">

                    {/* CUSTOMER */}

                    <div className="admin-order-section">

                      <h3>
                        <User
                          size={16}
                        />

                        Customer
                      </h3>

                      <div className="admin-customer-info">

                        <strong>
                          {order.user?.name ||
                            order
                              .shippingAddress
                              ?.fullName ||
                            "Customer"}
                        </strong>

                        <span>
                          <Mail
                            size={13}
                          />

                          {order.user
                            ?.email ||
                            "No email"}
                        </span>

                      </div>

                    </div>

                    {/* ADDRESS */}

                    <div className="admin-order-section">

                      <h3>
                        <MapPin
                          size={16}
                        />

                        Shipping Address
                      </h3>

                      <div className="admin-address">

                        <strong>
                          {order
                            .shippingAddress
                            ?.fullName ||
                            "—"}
                        </strong>

                        <span>
                          {
                            order
                              .shippingAddress
                              ?.address
                          }
                        </span>

                        <span>
                          {
                            order
                              .shippingAddress
                              ?.city
                          }

                          ,{" "}

                          {
                            order
                              .shippingAddress
                              ?.state
                          }

                          {" - "}

                          {
                            order
                              .shippingAddress
                              ?.pincode
                          }
                        </span>

                      </div>

                    </div>

                    {/* TOTAL */}

                    <div className="admin-order-section admin-order-total-section">

                      <h3>
                        <IndianRupee
                          size={16}
                        />

                        Total
                      </h3>

                      <strong className="admin-order-total">
                        {formatCurrency(
                          order.total
                        )}
                      </strong>

                      <span>
                        {order.paymentMethod ||
                          "COD"}
                      </span>

                    </div>

                  </div>

                  {/* ================================
                      PRODUCTS
                  ================================= */}

                  <div className="admin-order-products">

                    <h3>
                      Products
                    </h3>

                    <div className="admin-product-list">

                      {order.items?.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={`${order._id}-${index}`}
                            className="admin-order-product"
                          >

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                            />

                            <div>

                              <strong>
                                {item.name}
                              </strong>

                              <span>
                                Qty:{" "}
                                {
                                  item.quantity
                                }
                              </span>

                            </div>

                            <strong>
                              {formatCurrency(
                                item.price *
                                  item.quantity
                              )}
                            </strong>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                  {/* ================================
                      STATUS FOOTER
                  ================================= */}

                  <div className="admin-order-footer">

                    <div>

                      <span className="admin-status-label">
                        ORDER STATUS
                      </span>

                      <span
                        className={`admin-status-badge ${getStatusClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                    </div>

                    <div className="admin-status-control">

                      <label
                        htmlFor={`status-${order._id}`}
                      >
                        Update Status
                      </label>

                      <div className="admin-status-select">

                        <select
                          id={`status-${order._id}`}
                          value={
                            order.orderStatus ||
                            "Placed"
                          }
                          disabled={
                            updatingOrder ===
                            order._id
                          }
                          onChange={(
                            event
                          ) =>
                            updateOrderStatus(
                              order._id,
                              event.target.value
                            )
                          }
                        >

                          <option value="Placed">
                            Placed
                          </option>

                          <option value="Processing">
                            Processing
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                        </select>

                        <ChevronDown
                          size={15}
                        />

                      </div>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default AdminOrders;