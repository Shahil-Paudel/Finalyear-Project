import { useEffect, useState } from "react";
import { getContentRecommendations, logInteraction } from "../services/api";

export default function ContentRecommendationCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentRecommendations(5)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto py-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-56 w-40 shrink-0 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <p className="text-sm text-gray-500">
        No content-based recommendations available.
      </p>
    );
  }

  return (
    <section className="my-6">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">
        Similar Products Based on Your Purchases
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => logInteraction(p.id, "view")}
            className="w-40 shrink-0 cursor-pointer rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
          >
            <img
              src={p.image || "https://placehold.co/200x160?text=Product"}
              alt={p.name}
              className="mb-2 h-28 w-full rounded-lg object-cover"
            />

            <p className="truncate text-sm font-medium text-gray-800">
              {p.name}
            </p>

            <p className="text-sm font-semibold text-emerald-600">
              ${p.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}