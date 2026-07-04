import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { getSortedProducts, searchProducts } from "../services/api";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("price");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSorted = (by) => {
    setLoading(true);
    setError(null);
    getSortedProducts(by)
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to load sorted products:", err.response?.status, err.response?.data || err.message);
        setError(
          err.response?.status === 401
            ? "Your session expired. Please log in again."
            : "Failed to load products. Check the console for details."
        );
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSorted(sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      loadSorted(sortBy);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await searchProducts(query);
      setProducts(results);
    } catch (err) {
      console.error("Failed to search products:", err.response?.status, err.response?.data || err.message);
      setError(
        err.response?.status === 401
          ? "Your session expired. Please log in again."
          : "Search failed. Check the console for details."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Catalog</h1>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products (binary search)…"
            className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
            Search
          </button>
        </form>

        <div className="ml-auto flex gap-2 text-sm">
          <span className="text-gray-500">Sort (merge sort):</span>
          <button
            onClick={() => setSortBy("price")}
            className={`rounded-md px-3 py-1.5 ${sortBy === "price" ? "bg-brand-600 text-white" : "bg-gray-100"}`}
          >
            Price
          </button>
          <button
            onClick={() => setSortBy("name")}
            className={`rounded-md px-3 py-1.5 ${sortBy === "name" ? "bg-brand-600 text-white" : "bg-gray-100"}`}
          >
            Name
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}