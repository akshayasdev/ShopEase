import { useEffect, useState } from "react";
import axios from "axios";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import "../styles/ProductsPage.css";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  /*
    Fetch products when page loads
  */
  useEffect(() => {
  fetchProducts();

  const handleFocus = () => {
    fetchProducts();
  };

  window.addEventListener("focus", handleFocus);

  return () => {
    window.removeEventListener("focus", handleFocus);
  };
}, []);

  /*
    Refresh stock whenever the customer
    returns to this browser tab/window
  */
  useEffect(() => {
    const handleFocus = () => {
      fetchProducts();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "price-low") {
        return a.price - b.price;
      }

      if (sort === "price-high") {
        return b.price - a.price;
      }

      if (sort === "rating") {
        return b.rating - a.rating;
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
  };

  if (loading) {
    return (
      <main className="products-page">
        <div className="products-page-container">
          <div className="products-page-loading">
            <h2>Loading Products...</h2>
            <p>
              Please wait while we fetch our products.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-page">
        <div className="products-page-container">
          <div className="products-page-error">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="products-page">

      {/* PAGE HEADER */}
      <section className="products-page-header">
        <div className="products-page-container">
          <span className="section-label">
            Our Collection
          </span>

          <h1>All Products</h1>

          <p>
            Explore our complete collection of quality
            products, carefully selected for you.
          </p>
        </div>
      </section>

      {/* FILTER AREA */}
      <section className="products-filter-section">
        <div className="products-page-container">

          <div className="filter-top">

            {/* SEARCH */}
            <div className="search-box">
              <Search size={20} />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* SORT */}
            <div className="sort-box">
              <SlidersHorizontal size={18} />

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
              >
                <option value="default">
                  Sort By
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Highest Rated
                </option>

                <option value="name">
                  Name: A-Z
                </option>
              </select>
            </div>

          </div>

          {/* CATEGORY FILTER */}
          <div className="category-filters">

            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}

          </div>

          {/* RESULT COUNT */}
          <div className="results-row">

            <p>
              Showing{" "}
              <strong>
                {filteredProducts.length}
              </strong>{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </p>

            {(search ||
              category !== "All" ||
              sort !== "default") && (
              <button
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section className="all-products-section">
        <div className="products-page-container">

          {filteredProducts.length > 0 ? (
            <div className="all-products-grid">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}

            </div>
          ) : (
            <div className="no-products">

              <div className="no-products-icon">
                🔍
              </div>

              <h2>No Products Found</h2>

              <p>
                We couldn't find any products matching
                your search.
              </p>

              <button
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>
          )}

        </div>
      </section>

    </main>
  );
}

export default ProductsPage;