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
  Plus,
  Pencil,
  Trash2,
  Star,
  XCircle,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

import "../styles/AdminProducts.css";

function AdminProducts() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      category: "",
      price: "",
      originalPrice: "",
      discount: "",
      image: "",
      rating: "",
      stock: "",
      featured: false,
    });

  const adminUser = JSON.parse(
    localStorage.getItem(
      "shopeaseAdminUser"
    ) || "null"
  );

  /*
  ==================================================
  FETCH PRODUCTS
  ==================================================
  */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await axios.get(
          "http://localhost:5000/api/products"
        );

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

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
  ==================================================
  LOGOUT
  ==================================================
  */

  const handleLogout = () => {
    localStorage.removeItem(
      "shopeaseAdminToken"
    );

    localStorage.removeItem(
      "shopeaseAdminUser"
    );

    navigate("/admin/login");
  };

  /*
  ==================================================
  FORM CHANGE
  ==================================================
  */

  const handleFormChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /*
  ==================================================
  RESET FORM
  ==================================================
  */

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      originalPrice: "",
      discount: "",
      image: "",
      rating: "",
      stock: "",
      featured: false,
    });

    setEditingProduct(null);
  };

  /*
  ==================================================
  OPEN ADD FORM
  ==================================================
  */

  const openAddForm = () => {
    resetForm();

    setShowForm(true);
  };

  /*
  ==================================================
  OPEN EDIT FORM
  ==================================================
  */

  const openEditForm = (
    product
  ) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description:
        product.description || "",
      category:
        product.category || "",
      price:
        product.price ?? "",
      originalPrice:
        product.originalPrice ?? "",
      discount:
        product.discount ?? "",
      image:
        product.image || "",
      rating:
        product.rating ?? "",
      stock:
        product.stock ?? "",
      featured:
        Boolean(product.featured),
    });

    setShowForm(true);
  };

  /*
  ==================================================
  CLOSE FORM
  ==================================================
  */

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);

    resetForm();
  };

  /*
  ==================================================
  SAVE PRODUCT
  ==================================================
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.category.trim() ||
      formData.price === "" ||
      !formData.image.trim()
    ) {
      setError(
        "Please fill in all required product fields."
      );

      return;
    }

    if (
      Number(formData.price) < 0 ||
      Number(formData.stock || 0) < 0
    ) {
      setError(
        "Price and stock cannot be negative."
      );

      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem(
          "shopeaseAdminToken"
        );

      if (!token) {
        navigate("/admin/login");

        return;
      }

      const productData = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        category:
          formData.category.trim(),

        price:
          Number(formData.price),

        originalPrice:
          Number(
            formData.originalPrice || 0
          ),

        discount:
          Number(
            formData.discount || 0
          ),

        image:
          formData.image.trim(),

        rating:
          Number(formData.rating || 0),

        stock:
          Number(formData.stock || 0),

        featured:
          Boolean(formData.featured),
      };

      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/admin/${editingProduct._id}`,
          productData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/products/admin",
          productData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
      }

      setShowForm(false);

      resetForm();

      await fetchProducts();
    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      if (
        error.response?.status ===
          401 ||
        error.response?.status ===
          403
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
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  ==================================================
  DELETE PRODUCT
  ==================================================
  */

  const handleDelete = async (
    productId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);

      setError("");

      const token =
        localStorage.getItem(
          "shopeaseAdminToken"
        );

      await axios.delete(
        `http://localhost:5000/api/products/admin/${productId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setProducts((current) =>
        current.filter(
          (product) =>
            product._id !== productId
        )
      );
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      if (
        error.response?.status ===
          401 ||
        error.response?.status ===
          403
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
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
  ==================================================
  SEARCH
  ==================================================
  */

  const filteredProducts =
    products.filter((product) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      return (
        product.name
          ?.toLowerCase()
          .includes(search) ||
        product.category
          ?.toLowerCase()
          .includes(search) ||
        product.description
          ?.toLowerCase()
          .includes(search)
      );
    });

  /*
  ==================================================
  FORMAT PRICE
  ==================================================
  */

  const formatPrice = (
    amount
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount || 0);
  };

  /*
  ==================================================
  STOCK CLASS
  ==================================================
  */

  const getStockClass = (
    stock
  ) => {
    if (stock <= 0) {
      return "stock-out";
    }

    if (stock <= 5) {
      return "stock-low";
    }

    return "stock-good";
  };

  /*
  ==================================================
  RENDER
  ==================================================
  */

  return (
    <div className="admin-products-page">

      {/* ========================================
          MOBILE HEADER
      ======================================== */}

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

      {/* ========================================
          SIDEBAR
      ======================================== */}

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
            <LayoutDashboard
              size={19}
            />

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
            <ShoppingCart
              size={19}
            />

            <span>
              Orders
            </span>
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link active"
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
            className="admin-nav-link"
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

      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="admin-products-main">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="admin-products-header">

          <div>

            <span className="admin-page-label">
              PRODUCT MANAGEMENT
            </span>

            <h1>
              Products
            </h1>

            <p>
              Add, edit and manage
              products in your store.
            </p>

          </div>

          <div className="admin-products-header-actions">

            <button
              type="button"
              className="admin-refresh-button"
              onClick={
                fetchProducts
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

            <button
              type="button"
              className="admin-add-product-button"
              onClick={
                openAddForm
              }
            >
              <Plus size={17} />

              Add Product
            </button>

          </div>

        </div>

        {/* ======================================
            TOOLBAR
        ====================================== */}

        <div className="admin-products-toolbar">

          <div className="admin-products-count">

            <strong>
              {filteredProducts.length}
            </strong>

            <span>
              {filteredProducts.length ===
              1
                ? "Product"
                : "Products"}
            </span>

          </div>

          <div className="admin-products-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="admin-products-error">
            {error}

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <XCircle size={15} />
            </button>
          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading ? (
          <div className="admin-products-loading">

            <RefreshCw
              size={28}
              className="refresh-spinning"
            />

            <p>
              Loading products...
            </p>

          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="admin-products-empty">

            <div className="admin-products-empty-icon">
              <Package size={35} />
            </div>

            <h2>
              No products found
            </h2>

            <p>
              {searchTerm
                ? "No products match your search."
                : "Add your first product to start building your store."}
            </p>

            {!searchTerm && (
              <button
                type="button"
                onClick={
                  openAddForm
                }
                className="admin-empty-add-button"
              >
                <Plus size={16} />

                Add Product
              </button>
            )}

          </div>
        ) : (
          /* ====================================
             PRODUCTS
          ==================================== */

          <div className="admin-products-grid">

            {filteredProducts.map(
              (product) => (
                <article
                  className="admin-product-card"
                  key={product._id}
                >

                  {/* IMAGE */}

                  <div className="admin-product-image-wrapper">

                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                    />

                    {product.featured && (
                      <span className="admin-featured-badge">
                        <Star
                          size={11}
                          fill="currentColor"
                        />

                        Featured
                      </span>
                    )}

                    <div className="admin-product-actions">

                      <button
                        type="button"
                        title="Edit product"
                        onClick={() =>
                          openEditForm(
                            product
                          )
                        }
                      >
                        <Pencil
                          size={15}
                        />
                      </button>

                      <button
                        type="button"
                        title="Delete product"
                        className="delete"
                        disabled={
                          deletingId ===
                          product._id
                        }
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                      >
                        {deletingId ===
                        product._id ? (
                          <RefreshCw
                            size={15}
                            className="refresh-spinning"
                          />
                        ) : (
                          <Trash2
                            size={15}
                          />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="admin-product-content">

                    <span className="admin-product-category">
                      {product.category}
                    </span>

                    <h2>
                      {product.name}
                    </h2>

                    <p>
                      {product.description}
                    </p>

                    <div className="admin-product-price-row">

                      <strong>
                        {formatPrice(
                          product.price
                        )}
                      </strong>

                      {product.originalPrice >
                        product.price && (
                        <span>
                          {formatPrice(
                            product.originalPrice
                          )}
                        </span>
                      )}

                    </div>

                    <div className="admin-product-bottom">

                      <span
                        className={`admin-stock ${getStockClass(
                          product.stock
                        )}`}
                      >
                        {product.stock <=
                        0
                          ? "Out of stock"
                          : `${product.stock} in stock`}
                      </span>

                      <span className="admin-product-rating">
                        <Star
                          size={13}
                          fill="currentColor"
                        />

                        {product.rating ||
                          0}
                      </span>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </main>

      {/* ========================================
          PRODUCT FORM MODAL
      ======================================== */}

      {showForm && (
        <div
          className="admin-product-modal-overlay"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >

          <div className="admin-product-modal">

            <div className="admin-product-modal-header">

              <div>

                <span>
                  {editingProduct
                    ? "EDIT PRODUCT"
                    : "NEW PRODUCT"}
                </span>

                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="admin-product-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="admin-form-grid">

                {/* NAME */}

                <div className="admin-form-group full">
                  <label>
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleFormChange
                    }
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="admin-form-group full">
                  <label>
                    Description *
                  </label>

                  <textarea
                    name="description"
                    placeholder="Enter product description"
                    rows="4"
                    value={
                      formData.description
                    }
                    onChange={
                      handleFormChange
                    }
                  />
                </div>

                {/* CATEGORY */}

                <div className="admin-form-group">
                  <label>
                    Category *
                  </label>

                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Electronics"
                    value={
                      formData.category
                    }
                    onChange={
                      handleFormChange
                    }
                  />
                </div>

                {/* IMAGE */}

                <div className="admin-form-group">
                  <label>
                    Image URL *
                  </label>

                  <input
                    type="text"
                    name="image"
                    placeholder="https://..."
                    value={
                      formData.image
                    }
                    onChange={
                      handleFormChange
                    }
                  />
                </div>

                {/* PRICE */}

                <div className="admin-form-group">
                  <label>
                    Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    placeholder="0"
                    value={
                      formData.price
                    }
                    onChange={
                      handleFormChange
                    }
                  />
                </div>

                {/* ORIGINAL PRICE */}

                <div className="admin-form-group">
                  <label>
                    Original Price
                  </label>

                  <input
                    type="number"
                    name="originalPrice"
                    min="0"
                    placeholder="0"
                    value={
                      formData.originalPrice
                    }
                    onChange={
                      handleFormChange
                    }
                  />
                </div>

                {/* DISCOUNT */}

                <div className="admin-form-group">
                  <label>
                    Discount %
                  </label>

                  <input
                    type="number"
                    name="discount"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={
                      formData.discount
                    }
                    onChange={
                      handleFormChange
                    }
                  />
                </div>

                {/* RATING */}

                <div className="admin-form-group">
                  <label>
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0"
                    value={
                      formData.rating
                    }
                    onChange={
                      handleFormChange
                    }
                  />
                </div>

                {/* STOCK */}

                <div className="admin-form-group">
                  <label>
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    placeholder="0"
                    value={
                      formData.stock
                    }
                    onChange={
                      handleFormChange
                    }
                  />
                </div>

                {/* FEATURED */}

                <div className="admin-form-group admin-featured-field">

                  <label>
                    Featured Product
                  </label>

                  <label className="admin-checkbox">

                    <input
                      type="checkbox"
                      name="featured"
                      checked={
                        formData.featured
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <span>
                      Show this product
                      in Featured
                      Products
                    </span>

                  </label>

                </div>

              </div>

              {/* FORM ACTIONS */}

              <div className="admin-product-form-actions">

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={
                    closeForm
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-product-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="refresh-spinning"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Package
                        size={16}
                      />

                      {editingProduct
                        ? "Update Product"
                        : "Add Product"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminProducts;