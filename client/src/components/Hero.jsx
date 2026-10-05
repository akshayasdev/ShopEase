import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">

        {/* Left Content */}
        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={16} />
            <span>New Collection Available</span>
          </div>

          <h1>
            Find Something
            <span> You'll Love.</span>
          </h1>

          <p>
            Discover carefully selected products, exceptional quality,
            and everyday essentials designed to make your life better.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="hero-primary-btn">
              Shop Now
              <ArrowRight size={18} />
            </Link>

            <Link to="/products" className="hero-secondary-btn">
              Explore Collection
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>10K+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>5K+</strong>
              <span>Happy Customers</span>
            </div>

            <div>
              <strong>4.8</strong>
              <span>Customer Rating</span>
            </div>
          </div>

        </div>

        {/* Right Visual */}
        <div className="hero-visual">

          <div className="hero-circle"></div>

          <div className="hero-product-card">
            <div className="hero-product-image">
              <ShoppingBag size={100} strokeWidth={1.2} />
            </div>

            <div className="hero-product-info">
              <span>Featured Collection</span>
              <h3>Shop the Latest</h3>
              <p>Premium products for everyday living</p>
            </div>
          </div>

          <div className="floating-card floating-card-one">
            <span>✨</span>
            <div>
              <strong>Premium</strong>
              <small>Quality Products</small>
            </div>
          </div>

          <div className="floating-card floating-card-two">
            <span>🚚</span>
            <div>
              <strong>Free Delivery</strong>
              <small>On orders above ₹999</small>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;