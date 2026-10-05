import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  Mail,
  Lock,
  LogIn,
} from "lucide-react";

import "../styles/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(
        "Login response:",
        response.data
      );

      const user = response.data.user;

      if (!user) {
        setError(
          "Invalid login response."
        );
        return;
      }

      if (user.role !== "admin") {
        setError(
          "Access denied. This account is not an admin account."
        );
        return;
      }

      localStorage.setItem(
        "shopeaseAdminToken",
        response.data.token
      );

      localStorage.setItem(
        "shopeaseAdminUser",
        JSON.stringify(user)
      );

      navigate("/admin");
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-icon">
          <ShieldCheck size={38} />
        </div>

        <div className="admin-login-header">

          <span>
            SHOP EASE ADMIN
          </span>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in to manage your ShopEase
            store.
          </p>

        </div>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="admin-login-form"
        >

          <div className="admin-input-group">

            <label htmlFor="admin-email">
              Email Address
            </label>

            <div className="admin-input-wrapper">

              <Mail size={18} />

              <input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />

            </div>

          </div>

          <div className="admin-input-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-input-wrapper">

              <Lock size={18} />

              <input
                id="admin-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
              />

            </div>

          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}

            {!loading && (
              <LogIn size={18} />
            )}
          </button>

        </form>

        {/* CREATE ACCOUNT */}

        <div className="admin-login-register">

          <span>
            Don't have an admin account?
          </span>

          <Link to="/admin/register">
            Create an account
          </Link>

        </div>

        <p className="admin-login-note">
          This area is restricted to
          authorized administrators.
        </p>

      </div>

    </main>
  );
}

export default AdminLogin;