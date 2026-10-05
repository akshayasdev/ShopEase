import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  UserPlus,
} from "lucide-react";

import "../styles/AdminRegister.css";

function AdminRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all the fields."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/admin/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );

      console.log(
        "Admin registration response:",
        response.data
      );

      setSuccess(
        "Admin account created successfully! Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/admin/login");
      }, 1500);
    } catch (error) {
      console.error(
        "Admin registration error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Admin registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-register-page">
      <div className="admin-register-card">

        {/* ICON */}

        <div className="admin-register-icon">
          <ShieldCheck size={38} />
        </div>

        {/* HEADER */}

        <div className="admin-register-header">
          <span>
            SHOP EASE ADMIN
          </span>

          <h1>
            Create Account
          </h1>

          <p>
            Create your administrator account
            to manage ShopEase.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="admin-register-error">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="admin-register-success">
            {success}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="admin-register-form"
        >

          {/* NAME */}

          <div className="admin-register-input-group">

            <label htmlFor="admin-name">
              Full Name
            </label>

            <div className="admin-register-input-wrapper">

              <User size={18} />

              <input
                id="admin-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                autoComplete="name"
              />

            </div>

          </div>

          {/* EMAIL */}

          <div className="admin-register-input-group">

            <label htmlFor="admin-email">
              Email Address
            </label>

            <div className="admin-register-input-wrapper">

              <Mail size={18} />

              <input
                id="admin-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="admin-register-input-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-register-input-wrapper">

              <Lock size={18} />

              <input
                id="admin-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
              />

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="admin-register-input-group">

            <label htmlFor="admin-confirm-password">
              Confirm Password
            </label>

            <div className="admin-register-input-wrapper">

              <Lock size={18} />

              <input
                id="admin-confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="admin-register-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}

            {!loading && (
              <UserPlus size={18} />
            )}
          </button>

        </form>

        {/* LOGIN LINK */}

        <div className="admin-register-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/admin/login">
            Login
          </Link>

        </div>

      </div>
    </main>
  );
}

export default AdminRegister;