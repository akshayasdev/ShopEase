import {
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Camera,
  Send,
} from "lucide-react";

import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-column footer-brand">
          <h2>
            <span>🛍️</span> ShopEase
          </h2>

          <p>
            Discover quality products, great prices, and a shopping
            experience made just for you.
          </p>

          {/* Social Links */}
          <div className="social-links">

            <a href="#" aria-label="Website">
              <Globe size={18} />
            </a>

            <a href="#" aria-label="Messages">
              <MessageCircle size={18} />
            </a>

            <a href="#" aria-label="Social Media">
              <Camera size={18} />
            </a>

            <a href="#" aria-label="Share">
              <Send size={18} />
            </a>

          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/categories">Categories</a>
          <a href="/about">About Us</a>
        </div>

        {/* Customer Service */}
        <div className="footer-column">
          <h3>Customer Service</h3>

          <a href="#">Contact Us</a>
          <a href="#">Shipping & Delivery</a>
          <a href="#">Returns & Refunds</a>
          <a href="#">Privacy Policy</a>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <div className="contact-item">
            <MapPin size={17} />
            <span>Hyderabad, India</span>
          </div>

          <div className="contact-item">
            <Phone size={17} />
            <span>+91 98765 43210</span>
          </div>

          <div className="contact-item">
            <Mail size={17} />
            <span>support@shopease.com</span>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© 2026 ShopEase. All rights reserved.</p>

        <span>
          Made with ❤️ in India
        </span>
      </div>

    </footer>
  );
}

export default Footer;