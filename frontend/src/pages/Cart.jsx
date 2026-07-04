import { useEffect, useState } from "react";
import useCart from "../context/CartContext";
import { getHousehold, placeOrder } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,total, removeFromCart, increaseQuantity, decreaseQuantity, clearCart,
  } = useCart();

  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadHousehold() {
      try {
        const data = await getHousehold();
        setHousehold(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadHousehold();
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!household) {
      alert("Household not found.");
      return;
    }

    setLoading(true);

    try {
      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      await placeOrder(household.id, items);

      setMessage("🎉 Order placed successfully!");

      clearCart();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Unable to place order.");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        Shopping Cart
      </h1>

      {message && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
          {message}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">

          <h2 className="mb-4 text-2xl font-semibold">
            Your cart is empty
          </h2>

          <button
            onClick={() => navigate("/catalog")}
            className="rounded-lg bg-brand-600 px-6 py-3 text-white hover:bg-brand-700"
          >
            Continue Shopping
          </button>

        </div>
      ) : (
        <>
          <div className="space-y-5">

            {cart.map((item) => (

              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-white p-5 shadow"
              >

                <div className="flex items-center gap-5">

                  <img
                    src={
                      item.image ||
                      "https://placehold.co/120x120?text=Product"
                    }
                    alt={item.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />

                  <div>

                    <h2 className="text-xl font-semibold">
                      {item.name}
                    </h2>

                    <p className="text-gray-500">
                      ${item.price}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="rounded bg-gray-200 px-3 py-1"
                  >
                    -
                  </button>

                  <span className="font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="rounded bg-gray-200 px-3 py-1"
                  >
                    +
                  </button>

                </div>

                <div className="text-right">

                  <p className="font-bold text-brand-700">
                    $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 text-red-500 hover:underline"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

          <div className="mt-10 rounded-xl bg-white p-6 shadow">

            <div className="mb-4 flex justify-between text-2xl font-bold">

              <span>Total</span>

              <span className="text-brand-700">
                ${Number(total).toFixed(2)}
              </span>

            </div>

            <div className="flex gap-4">

              <button
                onClick={() => navigate("/catalog")}
                className="rounded-lg bg-gray-200 px-6 py-3 hover:bg-gray-300"
              >
                Continue Shopping
              </button>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>

            </div>

          </div>
        </>
      )}

    </div>
  );
}