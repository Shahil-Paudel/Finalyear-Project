import { Link } from "react-router-dom";
import useCart from "../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const {
    cart,
    total,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  if (!open) return null;

  return (
    <>
      {/* Background Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-96 flex-col bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold">
            Shopping Cart
          </h2>

          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">

          {cart.length === 0 ? (
            <div className="mt-20 text-center">

              <h3 className="text-xl font-semibold">
                Your cart is empty
              </h3>

              <p className="mt-2 text-gray-500">
                Add products from the catalog.
              </p>

            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="mb-4 rounded-lg border p-3"
              >
                <div className="flex gap-3">

                  <img
                    src={
                      item.image ||
                      "https://placehold.co/100x100?text=Product"
                    }
                    alt={item.name}
                    className="h-20 w-20 rounded object-cover"
                  />

                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-gray-500">
                      ${item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center gap-2">

                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="rounded bg-gray-200 px-2"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="rounded bg-gray-200 px-2"
                      >
                        +
                      </button>

                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Footer */}
        <div className="border-t p-5">

          <div className="mb-4 flex justify-between text-xl font-bold">
            <span>Total</span>

            <span>${Number(total).toFixed(2)}</span>
          </div>

          <Link
            to="/cart"
            onClick={onClose}
            className="block rounded-lg bg-brand-600 py-3 text-center text-white hover:bg-brand-700"
          >
            Go to Cart
          </Link>

        </div>

      </div>
    </>
  );
}