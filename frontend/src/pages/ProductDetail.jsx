import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, logInteraction } from "../services/api";
import useCart from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProduct(id);
        setProduct(data);

        // Log product view
        try {
          await logInteraction(id, "view");
        } catch (err) {
          console.log("Interaction log skipped.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    addToCart(product);

    try {
      await logInteraction(product.id, "cart");
    } catch (err) {
      console.log("Cart interaction not logged.");
    }

    setMessage("✅ Product added to cart!");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-lg">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="grid gap-10 md:grid-cols-2">

        {/* Image */}

        <div>
          <img
            src={
              product.image ||
              "https://placehold.co/600x500?text=No+Image"
            }
            alt={product.name}
            className="h-[450px] w-full rounded-xl border object-cover"
          />
        </div>

        {/* Details */}

        <div>

          <h1 className="mb-2 text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mb-4 text-gray-500">
            {product.category?.name}
          </p>

          <h2 className="mb-6 text-3xl font-bold text-brand-700">
            ${product.price}
          </h2>

          <p className="mb-6 leading-7 text-gray-700">
            {product.description || "No description available."}
          </p>

          <div className="mb-4">

            <span className="font-semibold">
              Stock :
            </span>{" "}

            {product.stock > 0 ? (
              <span className="text-green-600">
                {product.stock} Available
              </span>
            ) : (
              <span className="text-red-500">
                Out of Stock
              </span>
            )}

          </div>

          <div className="mb-8">

            <span className="font-semibold">
              Tags :
            </span>{" "}

            {product.tags || "None"}

          </div>

          {message && (
            <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
              {message}
            </div>
          )}

          <div className="flex gap-4">

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="rounded-lg bg-brand-600 px-6 py-3 text-white transition hover:bg-brand-700 disabled:bg-gray-400"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                handleAddToCart();
                navigate("/cart");
              }}
              disabled={product.stock === 0}
              className="rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700 disabled:bg-gray-400"
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}