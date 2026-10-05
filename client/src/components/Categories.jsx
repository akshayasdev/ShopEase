import CategoryCard from "./CategoryCard";
import "../styles/Categories.css";

const categories = [
  {
    name: "Fashion",
    items: 1250,
    icon: "fashion",
  },
  {
    name: "Electronics",
    items: 860,
    icon: "electronics",
  },
  {
    name: "Beauty",
    items: 540,
    icon: "beauty",
  },
  {
    name: "Home & Living",
    items: 720,
    icon: "home",
  },
  {
    name: "Sports",
    items: 430,
    icon: "sports",
  },
  {
    name: "Grocery",
    items: 980,
    icon: "grocery",
  },
];

function Categories() {
  return (
    <section className="categories-section">

      <div className="categories-header">
        <h2>Shop by Category</h2>
        <p>
          Explore our wide range of products across popular categories.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.name}
            category={category}
          />
        ))}
      </div>

    </section>
  );
}

export default Categories;