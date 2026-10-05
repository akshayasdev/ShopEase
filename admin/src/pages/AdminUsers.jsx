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
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

import "../styles/AdminUsers.css";

function AdminUsers() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const adminUser = JSON.parse(
    localStorage.getItem(
      "shopeaseAdminUser"
    ) || "null"
  );

  /* =========================================
     FETCH USERS
  ========================================= */

  const fetchUsers = async () => {
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
          "http://localhost:5000/api/admin/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : response.data.users || []
      );
    } catch (error) {
      console.error(
        "Fetch users error:",
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
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "shopeaseAdminToken"
    );

    localStorage.removeItem(
      "shopeaseAdminUser"
    );

    navigate("/admin/login");
  };

  /* =========================================
     SEARCH
  ========================================= */

  const filteredUsers =
    users.filter((user) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      return (
        user.name
          ?.toLowerCase()
          .includes(search) ||
        user.email
          ?.toLowerCase()
          .includes(search)
      );
    });

  /* =========================================
     DATE FORMAT
  ========================================= */

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

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="admin-users-page">

      {/* MOBILE HEADER */}

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

      {/* SIDEBAR */}

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
            <LayoutDashboard size={19} />

            <span>
              Dashboard
            </span>
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <ShoppingCart size={19} />

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
            className="admin-nav-link active"
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

      {/* OVERLAY */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* MAIN */}

      <main className="admin-users-main">

        {/* HEADER */}

        <div className="admin-users-header">

          <div>

            <span className="admin-page-label">
              USER MANAGEMENT
            </span>

            <h1>
              Users
            </h1>

            <p>
              View registered customers
              and account information.
            </p>

          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              fetchUsers
            }
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

        {/* TOOLBAR */}

        <div className="admin-users-toolbar">

          <div className="admin-users-count">

            <strong>
              {filteredUsers.length}
            </strong>

            <span>
              {filteredUsers.length ===
              1
                ? "User"
                : "Users"}
            </span>

          </div>

          <div className="admin-users-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="admin-users-error">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="admin-users-loading">

            <RefreshCw
              size={28}
              className="refresh-spinning"
            />

            <p>
              Loading users...
            </p>

          </div>
        ) : filteredUsers.length ===
          0 ? (
          <div className="admin-users-empty">

            <div className="admin-users-empty-icon">
              <Users size={35} />
            </div>

            <h2>
              No users found
            </h2>

            <p>
              {searchTerm
                ? "No users match your search."
                : "Registered customers will appear here."}
            </p>

          </div>
        ) : (
          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>
                <tr>

                  <th>
                    USER
                  </th>

                  <th>
                    EMAIL
                  </th>

                  <th>
                    ROLE
                  </th>

                  <th>
                    JOINED
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => (
                    <tr
                      key={user._id}
                    >

                      <td>

                        <div className="admin-user-table-info">

                          <div className="admin-table-avatar">
                            {user.name
                              ? user.name
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()
                              : "U"}
                          </div>

                          <div>
                            <strong>
                              {user.name ||
                                "Unknown User"}
                            </strong>

                            <span>
                              Customer
                            </span>
                          </div>

                        </div>

                      </td>

                      <td>

                        <div className="admin-user-email">

                          <Mail size={14} />

                          <span>
                            {user.email}
                          </span>

                        </div>

                      </td>

                      <td>

                        <span
                          className={
                            user.role ===
                            "admin"
                              ? "admin-role-badge admin-role"
                              : "admin-role-badge user-role"
                          }
                        >
                          {user.role ===
                          "admin" ? (
                            <>
                              <ShieldCheck
                                size={12}
                              />

                              Admin
                            </>
                          ) : (
                            <>
                              <User
                                size={12}
                              />

                              User
                            </>
                          )}
                        </span>

                      </td>

                      <td>

                        <span className="admin-joined-date">
                          {formatDate(
                            user.createdAt
                          )}
                        </span>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </main>

    </div>
  );
}

export default AdminUsers;