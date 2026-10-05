import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  Menu,
  X,
  RefreshCw,
  TrendingUp,
  IndianRupee,
  ArrowRight,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [orderStatus, setOrderStatus] =
    useState({
      Placed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    });

  const [lowStockProducts, setLowStockProducts] =
    useState([]);

  const [outOfStockProducts, setOutOfStockProducts] =
    useState(0);

  const [recentOrders, setRecentOrders] =
    useState([]);

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
      "Admin user parse error:",
      error
    );
  }

  /* ================================
     FETCH DASHBOARD DATA
  ================================= */

  const fetchDashboardData = async () => {
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

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard/stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
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

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load dashboard."
        );
      }

      /* ================================
         BASIC STATS
      ================================= */

      setStats({
        totalUsers:
          data.totalUsers || 0,

        totalProducts:
          data.totalProducts || 0,

        totalOrders:
          data.totalOrders || 0,

        totalRevenue:
          data.totalRevenue || 0,
      });

      /* ================================
         ORDER STATUS
      ================================= */

      setOrderStatus({
        Placed:
          data.orderStatus?.Placed || 0,

        Processing:
          data.orderStatus?.Processing || 0,

        Shipped:
          data.orderStatus?.Shipped || 0,

        Delivered:
          data.orderStatus?.Delivered || 0,

        Cancelled:
          data.orderStatus?.Cancelled || 0,
      });

      /* ================================
         LOW STOCK
      ================================= */

      setLowStockProducts(
        data.lowStockProducts || []
      );

      setOutOfStockProducts(
        data.outOfStockProducts || 0
      );

      /* ================================
         RECENT ORDERS
      ================================= */

      setRecentOrders(
        data.recentOrders || []
      );
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setError(
        error.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     LOAD DASHBOARD
  ================================= */

  useEffect(() => {
    fetchDashboardData();
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
    ).format(amount);
  };

  /* ================================
     FORMAT DATE
  ================================= */

  const formatDate = (date) => {
    if (!date) return "-";

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
     STATUS CLASS
  ================================= */

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "delivered";

      case "Shipped":
        return "shipped";

      case "Processing":
        return "processing";

      case "Cancelled":
        return "cancelled";

      case "Placed":
      default:
        return "placed";
    }
  };

  /* ================================
     ADMIN INITIAL
  ================================= */

  const adminInitial =
    adminUser?.name
      ? adminUser.name
          .charAt(0)
          .toUpperCase()
      : "A";

  return (
    <div className="admin-dashboard-page">

      {/* ================================
          MOBILE HEADER
      ================================= */}

      <div className="admin-mobile-header">
        <button
          className="admin-mobile-menu"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          <Menu size={22} />
        </button>

        <h2>
          Shop<span>Ease</span>
        </h2>

        <div className="admin-mobile-avatar">
          {adminInitial}
        </div>
      </div>

      {/* ================================
          MOBILE OVERLAY
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
          SIDEBAR
      ================================= */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >
        <div className="admin-sidebar-logo">
          <h2>
            Shop<span>Ease</span>
          </h2>

          <p>ADMIN PANEL</p>

          <button
            className="admin-sidebar-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">

          <Link
            to="/admin"
            className="active"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/orders"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </Link>

          <Link
            to="/admin/products"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Package size={18} />
            <span>Products</span>
          </Link>

          <Link
            to="/admin/users"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Users size={18} />
            <span>Users</span>
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-profile">
            <div className="admin-avatar">
              {adminInitial}
            </div>

            <div className="admin-profile-info">
              <strong>
                {adminUser?.name ||
                  "Administrator"}
              </strong>

              <span>
                {adminUser?.email ||
                  "Admin"}
              </span>
            </div>
          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

        </div>
      </aside>

      {/* ================================
          MAIN
      ================================= */}

      <main className="admin-dashboard-main">

        {/* TOPBAR */}

        <header className="admin-dashboard-topbar">
          <div>
            <h1>Dashboard</h1>

            <p>
              Overview of your ShopEase
              store.
            </p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "admin-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </header>

        {/* CONTENT */}

        <section className="admin-dashboard-content">

          {/* ERROR */}

          {error && (
            <div className="admin-dashboard-error">
              {error}
            </div>
          )}

          {/* ================================
              STAT CARDS
          ================================= */}

          <div className="admin-stat-grid">

            <div className="admin-stat-card">
              <div className="admin-stat-icon orders">
                <ShoppingBag size={21} />
              </div>

              <div className="admin-stat-info">
                <span>Total Orders</span>

                <strong>
                  {loading
                    ? "..."
                    : stats.totalOrders}
                </strong>
              </div>

              <div className="admin-stat-trend">
                <TrendingUp size={14} />
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon revenue">
                <IndianRupee size={21} />
              </div>

              <div className="admin-stat-info">
                <span>Total Revenue</span>

                <strong>
                  {loading
                    ? "..."
                    : formatCurrency(
                        stats.totalRevenue
                      )}
                </strong>
              </div>

              <div className="admin-stat-trend">
                <TrendingUp size={14} />
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon products">
                <Package size={21} />
              </div>

              <div className="admin-stat-info">
                <span>Total Products</span>

                <strong>
                  {loading
                    ? "..."
                    : stats.totalProducts}
                </strong>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon users">
                <Users size={21} />
              </div>

              <div className="admin-stat-info">
                <span>Total Users</span>

                <strong>
                  {loading
                    ? "..."
                    : stats.totalUsers}
                </strong>
              </div>
            </div>

          </div>

          {/* ================================
              ORDER STATUS
          ================================= */}

          <div className="admin-dashboard-section">

            <div className="admin-section-heading">
              <div>
                <h2>Order Status</h2>

                <p>
                  Current status of all
                  customer orders.
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="admin-view-all"
              >
                Manage Orders
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="admin-order-status-grid">

              <div className="admin-status-card placed">
                <div className="admin-status-icon">
                  <Clock size={20} />
                </div>

                <div>
                  <span>Placed</span>

                  <strong>
                    {loading
                      ? "..."
                      : orderStatus.Placed}
                  </strong>
                </div>
              </div>

              <div className="admin-status-card processing">
                <div className="admin-status-icon">
                  <RefreshCw size={20} />
                </div>

                <div>
                  <span>Processing</span>

                  <strong>
                    {loading
                      ? "..."
                      : orderStatus.Processing}
                  </strong>
                </div>
              </div>

              <div className="admin-status-card shipped">
                <div className="admin-status-icon">
                  <Truck size={20} />
                </div>

                <div>
                  <span>Shipped</span>

                  <strong>
                    {loading
                      ? "..."
                      : orderStatus.Shipped}
                  </strong>
                </div>
              </div>

              <div className="admin-status-card delivered">
                <div className="admin-status-icon">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <span>Delivered</span>

                  <strong>
                    {loading
                      ? "..."
                      : orderStatus.Delivered}
                  </strong>
                </div>
              </div>

              <div className="admin-status-card cancelled">
                <div className="admin-status-icon">
                  <XCircle size={20} />
                </div>

                <div>
                  <span>Cancelled</span>

                  <strong>
                    {loading
                      ? "..."
                      : orderStatus.Cancelled}
                  </strong>
                </div>
              </div>

            </div>
          </div>

          {/* ================================
              LOW STOCK
          ================================= */}

          <div className="admin-dashboard-section">

            <div className="admin-section-heading">

              <div>
                <h2>Inventory Alerts</h2>

                <p>
                  Products that need
                  attention.
                </p>
              </div>

              <Link
                to="/admin/products"
                className="admin-view-all"
              >
                Manage Products
                <ArrowRight size={14} />
              </Link>

            </div>

            <div className="admin-inventory-summary">

              <div className="admin-inventory-alert out-stock">
                <div className="admin-inventory-alert-icon">
                  <XCircle size={21} />
                </div>

                <div>
                  <span>
                    Out of Stock
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : outOfStockProducts}
                  </strong>
                </div>
              </div>

              <div className="admin-inventory-alert low-stock">
                <div className="admin-inventory-alert-icon">
                  <AlertTriangle size={21} />
                </div>

                <div>
                  <span>
                    Low Stock
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : lowStockProducts.filter(
                          (product) =>
                            product.stock > 0
                        ).length}
                  </strong>
                </div>
              </div>

            </div>

            {loading ? (
              <div className="admin-inventory-loading">
                Loading inventory...
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="admin-inventory-empty">
                <CheckCircle2 size={30} />

                <div>
                  <strong>
                    Inventory looks good
                  </strong>

                  <p>
                    No products currently
                    have low stock.
                  </p>
                </div>
              </div>
            ) : (
              <div className="admin-low-stock-list">

                {lowStockProducts.map(
                  (product) => (
                    <div
                      className="admin-low-stock-item"
                      key={product._id}
                    >

                      <div className="admin-low-stock-product">

                        <img
                          src={product.image}
                          alt={product.name}
                        />

                        <div>
                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.category}
                          </span>
                        </div>

                      </div>

                      <div className="admin-low-stock-price">
                        {formatCurrency(
                          product.price
                        )}
                      </div>

                      <div
                        className={`admin-stock-count ${
                          product.stock <= 0
                            ? "stock-out"
                            : product.stock <= 2
                            ? "stock-critical"
                            : "stock-low"
                        }`}
                      >
                        {product.stock <= 0
                          ? "Out of stock"
                          : `${product.stock} left`}
                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* ================================
              RECENT ORDERS
          ================================= */}

          <div className="admin-dashboard-section">

            <div className="admin-section-heading admin-orders-heading">

              <div>
                <h2>Recent Orders</h2>

                <p>
                  Latest orders received
                  from customers.
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="admin-view-all"
              >
                View All
                <ArrowRight size={14} />
              </Link>

            </div>

            <div className="admin-recent-orders">

              {loading ? (
                <div className="admin-orders-loading">
                  Loading recent orders...
                </div>
              ) : recentOrders.length ===
                0 ? (
                <div className="admin-orders-empty">
                  <ShoppingBag size={40} />

                  <h3>
                    No orders yet
                  </h3>

                  <p>
                    Orders will appear
                    here when customers
                    place them.
                  </p>
                </div>
              ) : (
                <div className="admin-recent-orders-table">

                  <div className="admin-recent-orders-header">
                    <span>ORDER</span>
                    <span>CUSTOMER</span>
                    <span>TOTAL</span>
                    <span>STATUS</span>
                    <span>DATE</span>
                  </div>

                  {recentOrders.map(
                    (order) => (
                      <div
                        className="admin-recent-order-row"
                        key={order._id}
                      >

                        <span className="admin-order-id">
                          #
                          {order._id
                            .slice(-6)
                            .toUpperCase()}
                        </span>

                        <div className="admin-order-customer">
                          <strong>
                            {order.user?.name ||
                              order.shippingAddress
                                ?.fullName ||
                              "Customer"}
                          </strong>

                          <small>
                            {order.user?.email ||
                              ""}
                          </small>
                        </div>

                        <strong className="admin-order-total">
                          {formatCurrency(
                            order.total
                          )}
                        </strong>

                        <span
                          className={`admin-order-status ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                        <span className="admin-order-date">
                          {formatDate(
                            order.createdAt
                          )}
                        </span>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

          </div>

          {/* ================================
              QUICK ACTIONS
          ================================= */}

          <div className="admin-dashboard-section">

            <div className="admin-section-heading">

              <div>
                <h2>Quick Actions</h2>

                <p>
                  Manage your store
                  quickly.
                </p>
              </div>

            </div>

            <div className="admin-quick-actions">

              <Link
                to="/admin/products"
                className="admin-quick-card"
              >
                <div className="admin-quick-icon">
                  <Package size={20} />
                </div>

                <div>
                  <strong>
                    Manage Products
                  </strong>

                  <span>
                    Add, edit or remove
                    products
                  </span>
                </div>

                <ArrowRight size={17} />
              </Link>

              <Link
                to="/admin/orders"
                className="admin-quick-card"
              >
                <div className="admin-quick-icon">
                  <ShoppingBag size={20} />
                </div>

                <div>
                  <strong>
                    Manage Orders
                  </strong>

                  <span>
                    View and update
                    orders
                  </span>
                </div>

                <ArrowRight size={17} />
              </Link>

              <Link
                to="/admin/users"
                className="admin-quick-card"
              >
                <div className="admin-quick-icon">
                  <Users size={20} />
                </div>

                <div>
                  <strong>
                    View Users
                  </strong>

                  <span>
                    View registered
                    customers
                  </span>
                </div>

                <ArrowRight size={17} />
              </Link>

            </div>

          </div>

          {/* ================================
              STORE OVERVIEW
          ================================= */}

          <div className="admin-dashboard-section">

            <div className="admin-section-heading">

              <div>
                <h2>Store Overview</h2>

                <p>
                  Current store
                  statistics.
                </p>
              </div>

            </div>

            <div className="admin-overview-grid">

              <div className="admin-overview-card">
                <span>
                  Registered Customers
                </span>

                <strong>
                  {loading
                    ? "..."
                    : stats.totalUsers}
                </strong>

                <Link to="/admin/users">
                  View Users
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="admin-overview-card">
                <span>
                  Products in Store
                </span>

                <strong>
                  {loading
                    ? "..."
                    : stats.totalProducts}
                </strong>

                <Link to="/admin/products">
                  View Products
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="admin-overview-card">
                <span>
                  Orders Received
                </span>

                <strong>
                  {loading
                    ? "..."
                    : stats.totalOrders}
                </strong>

                <Link to="/admin/orders">
                  View Orders
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;