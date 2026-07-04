import { Link } from "react-router-dom";
import RecommendationCarousel from "../components/RecommendationCarousel";
import ContentRecommendationCarousel from "../components/ContentRecommendationCarousel";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { username } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold">
            Welcome{username ? `, ${username}` : ""} 👋
          </h1>

          <p className="mt-6 text-lg max-w-2xl mx-auto text-green-100">
            Smart shopping for every household. Discover quality products,
            personalized recommendations, and everything your home needs in one
            place.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/catalog"
              className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>

            {!username && (
              <Link
                to="/register"
                className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-green-600 transition"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Why Choose HouseNest?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition">
            <div className="text-5xl">🏠</div>
            <h3 className="mt-4 text-xl font-semibold">
              Household Essentials
            </h3>
            <p className="mt-2 text-gray-600">
              Shop kitchen, furniture, cleaning, bedding, bath, and home decor
              products.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition">
            <div className="text-5xl">🤖</div>
            <h3 className="mt-4 text-xl font-semibold">
              AI Recommendations
            </h3>
            <p className="mt-2 text-gray-600">
              Receive personalized product recommendations based on your
              household's shopping habits.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition">
            <div className="text-5xl">🚚</div>
            <h3 className="mt-4 text-xl font-semibold">
              Fast & Easy Shopping
            </h3>
            <p className="mt-2 text-gray-600">
              Browse products, manage your cart, and complete your shopping with
              ease.
            </p>
          </div>
        </div>
      </section>

           {/* Recommendation Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">

          {username ? (
            <>
              {/* Hybrid Recommendation */}
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Recommended For You 
              </h2>

              <RecommendationCarousel />

              {/* Content-Based Recommendation */}
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                  Similar Products Based on Your Purchases
                </h2>

                <ContentRecommendationCarousel />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Recommended For You
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-green-700 text-lg">
                  Log in to unlock personalized recommendations for your
                  household.
                </p>

                <Link
                  to="/login"
                  className="inline-block mt-5 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Login
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-800">
          Start Shopping Today
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Explore hundreds of household products carefully organized into
          categories and discover items tailored to your needs.
        </p>

        <Link
          to="/catalog"
          className="inline-block mt-8 bg-green-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-green-700 transition"
        >
          Browse Products
        </Link>
      </section>
    </div>
  );
}