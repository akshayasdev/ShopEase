import { useState } from "react";
import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  Package,
} from "lucide-react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";

import "../styles/Navbar.css";

function Navbar() {
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("shopeaseToken");
    localStorage.removeItem("shopeaseUser");

    navigate("/");

    window.location.reload();
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================== */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="navbar-logo-icon">
            🛍️
          </span>

          <span>ShopEase</span>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

        <nav className="navbar-links">

          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/products">
            Products
          </NavLink>

          <NavLink to="/categories">
            Categories
          </NavLink>

          {user && (
            <NavLink to="/orders">
              My Orders
            </NavLink>
          )}

          <NavLink to="/about">
            About
          </NavLink>

        </nav>

        {/* =========================
            ACTIONS
        ========================== */}

        <div className="navbar-actions">

          {/* SEARCH */}

          <button
            className="navbar-icon-btn"
            aria-label="Search"
            onClick={() =>
              navigate("/products")
            }
          >
            <Search size={20} />
          </button>

          {/* WISHLIST */}

          <button
            className="navbar-icon-btn"
            aria-label="Wishlist"
            onClick={() =>
              navigate("/wishlist")
            }
          >
            <Heart size={20} />
          </button>

          {/* CART */}

          <button
            className="navbar-icon-btn cart-btn"
            aria-label="Shopping cart"
            onClick={() =>
              navigate("/cart")
            }
          >
            <ShoppingCart size={20} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </button>

          {/* =========================
              LOGGED IN USER
          ========================== */}

          {user ? (
            <div className="navbar-user">

              <div className="navbar-user-info">

                <User size={18} />

                <span>
                  Hi,{" "}
                  {user.name?.split(" ")[0]}
                </span>

              </div>

              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />

                Logout
              </button>

            </div>
          ) : (

            /* LOGIN */

            <Link
              to="/login"
              className="navbar-login"
            >
              Login
            </Link>

          )}

          {/* MOBILE MENU BUTTON */}

          <button
            className="navbar-menu-btn"
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

      </div>

      {/* =========================
          MOBILE MENU
      ========================== */}

      {menuOpen && (
        <div className="mobile-menu">

          <NavLink
            to="/"
            end
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            onClick={closeMenu}
          >
            Products
          </NavLink>

          <NavLink
            to="/categories"
            onClick={closeMenu}
          >
            Categories
          </NavLink>

          <NavLink
            to="/wishlist"
            onClick={closeMenu}
          >
            Wishlist
          </NavLink>

          {user && (
            <NavLink
              to="/orders"
              onClick={closeMenu}
            >
              <Package size={17} />
              My Orders
            </NavLink>
          )}

          <NavLink
            to="/cart"
            onClick={closeMenu}
          >
            Cart
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMenu}
          >
            About
          </NavLink>

          {user ? (
            <button
              className="mobile-logout"
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
            >
              <LogOut size={17} />
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMenu}
            >
              Login
            </NavLink>
          )}

        </div>
      )}

    </header>
  );
}

export default Navbar;