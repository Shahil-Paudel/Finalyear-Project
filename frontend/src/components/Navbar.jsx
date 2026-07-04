import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { username, logout } = useAuth();
  const { cart } = useCart();

  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 shadow-sm">

        <Link
          to="/"
          className="text-xl font-bold text-brand-700"
        >
          🏠 HomeNest
        </Link>

        <div className="flex items-center gap-6 text-sm">

          <Link
            to="/catalog"
            className="text-gray-600 hover:text-brand-700"
          >
            Catalog
          </Link>

          <button
            onClick={() => setOpenCart(true)}
            className="relative text-gray-600 hover:text-brand-700"
          >
            🛒 Cart

            {cart.length > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cart.length}
              </span>
            )}
          </button>

          <Link
            to="/household"
            className="text-gray-600 hover:text-brand-700"
          >
            Household
          </Link>

          {username ? (
            <>
              <span className="text-gray-500">
                Hi, {username}
              </span>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700"
            >
              Log in
            </Link>
          )}

        </div>
      </nav>

      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
      />
    </>
  );
}