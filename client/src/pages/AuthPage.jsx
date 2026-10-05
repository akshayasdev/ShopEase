import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import axios from "axios";

import "../styles/AuthPage.css";

function AuthPage() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const data = isRegister
        ? {
            name,
            email,
            password,
          }
        : {
            email,
            password,
          };

      const response = await axios.post(endpoint, data);

      localStorage.setItem(
        "shopeaseToken",
        response.data.token
      );

      localStorage.setItem(
        "shopeaseUser",
        JSON.stringify(response.data.user)
      );

      setSuccess(
        isRegister
          ? "Account created successfully!"
          : "Login successful!"
      );

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error("Authentication error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister((current) => !current);

    setName("");
    setEmail("");
    setPassword("");

    setError("");
    setSuccess("");
  };

  return (
    <main className="auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-brand">

          <Link to="/" className="auth-logo">
            <span>🛍️</span>
            ShopEase
          </Link>

          <div className="auth-brand-content">

            <span className="auth-label">
              {isRegister
                ? "JOIN SHOPEASE"
                : "WELCOME BACK"}
            </span>

            <h1>
              {isRegister
                ? "Start your shopping journey."
                : "Welcome back to ShopEase."}
            </h1>

            <p>
              Discover quality products, great prices,
              and a shopping experience made just for you.
            </p>

          </div>

        </div>

        {/* FORM SIDE */}
        <div className="auth-form-container">

          <div className="auth-form-header">

            <h2>
              {isRegister
                ? "Create Account"
                : "Sign In"}
            </h2>

            <p>
              {isRegister
                ? "Create your ShopEase account"
                : "Sign in to continue shopping"}
            </p>

          </div>

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            {isRegister && (
              <div className="auth-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="auth-input">

                  <User size={18} />

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />

                </div>

              </div>
            )}

            {/* EMAIL */}
            <div className="auth-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="auth-input">

                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="auth-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="auth-input">

                <Lock size={18} />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegister
                ? "Create Account"
                : "Sign In"}
            </button>

          </form>

          {/* SWITCH */}
          <div className="auth-switch">

            <span>
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
            >
              {isRegister
                ? "Sign In"
                : "Create Account"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

export default AuthPage;