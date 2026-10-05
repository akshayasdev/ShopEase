import {
  Shirt,
  Smartphone,
  Sparkles,
  Home,
  Dumbbell,
  ShoppingBasket,
} from "lucide-react";
import "../styles/Categories.css";

const iconMap = {
  fashion: Shirt,
  electronics: Smartphone,
  beauty: Sparkles,
  home: Home,
  sports: Dumbbell,
  grocery: ShoppingBasket,
};

function CategoryCard({ category }) {
  const Icon = iconMap[category.icon];

  return (
    <div className="category-card">
      <div className="category-icon">
        <Icon size={30} strokeWidth={1.8} />
      </div>

      <h3>{category.name}</h3>
      <p>{category.items} Products</p>
    </div>
  );
}

export default CategoryCard;