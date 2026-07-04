import { useNavigate } from "react-router-dom";
import { logInteraction } from "../services/api";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await logInteraction(product.id, "view");
    } catch (err) {}

    navigate(`/products/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
    >
      <img
        src={product.image || "https://placehold.co/300x200?text=Product"}
        alt={product.name}
        className="mb-2 h-32 w-full rounded-lg object-cover"
      />

      <p className="truncate text-sm font-medium text-gray-800">
        {product.name}
      </p>

      <p className="text-xs text-gray-400">
        {product.category?.name}
      </p>

      <p className="mt-1 text-sm font-semibold text-brand-700">
        ${product.price}
      </p>
    </div>
  );
}