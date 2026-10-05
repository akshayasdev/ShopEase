import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";

import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function About() {
  return (
    <main
      style={{
        minHeight: "70vh",
        padding: "100px 20px",
        textAlign: "center",
        background: "#fafaf9",
      }}
    >
      <h1>About ShopEase</h1>

      <p>
        Welcome to ShopEase — your destination for
        quality products and a better shopping
        experience.
      </p>
    </main>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>

            {/* =========================
                HOME
            ========================== */}

            <Route
              path="/"
              element={<Home />}
            />

            {/* =========================
                PRODUCTS
            ========================== */}

            <Route
              path="/products"
              element={<ProductsPage />}
            />

            {/* =========================
                CATEGORIES
            ========================== */}

            <Route
              path="/categories"
              element={<ProductsPage />}
            />

            {/* =========================
                PRODUCT DETAILS
            ========================== */}

            <Route
              path="/products/:id"
              element={<ProductDetailsPage />}
            />

            {/* =========================
                CART
            ========================== */}

            <Route
              path="/cart"
              element={<CartPage />}
            />

            {/* =========================
                WISHLIST
            ========================== */}

            <Route
              path="/wishlist"
              element={<WishlistPage />}
            />

            {/* =========================
                CHECKOUT
            ========================== */}

            <Route
              path="/checkout"
              element={<CheckoutPage />}
            />

            {/* =========================
                MY ORDERS
            ========================== */}

            <Route
              path="/orders"
              element={<MyOrdersPage />}
            />

            {/* =========================
                ORDER SUCCESS
            ========================== */}

            <Route
              path="/order-success/:id"
              element={<OrderSuccessPage />}
            />

            {/* =========================
                LOGIN / REGISTER
            ========================== */}

            <Route
              path="/login"
              element={<AuthPage />}
            />

            {/* =========================
                ABOUT
            ========================== */}

            <Route
              path="/about"
              element={<About />}
            />

          </Routes>

          <Footer />

        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;