import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../styles/Products.css";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        const featuredProducts = response.data.filter(
          (product) => product.featured
        );

        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="products-section">
        <div className="products-container">
          <div className="section-heading">
            <span className="section-label">Featured</span>
            <h2>Featured Products</h2>
            <p>Loading our best products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <div className="products-container">
          <div className="section-heading">
            <span className="section-label">Featured</span>
            <h2>Featured Products</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="products-container">

        <div className="section-heading">
          <span className="section-label">Featured</span>
          <h2>Featured Products</h2>
          <p>
            Discover some of our most popular products, carefully selected
            for you.
          </p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;