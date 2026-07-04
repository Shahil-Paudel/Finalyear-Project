export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo / About */}
        <div>
          <h2 className="text-2xl font-bold text-green-400">HouseNest</h2>
          <p className="mt-3 text-gray-300">
            Your AI-powered household e-commerce platform for smart shopping,
            personalized recommendations, and seamless home management.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="/" className="hover:text-green-400">
                Home
              </a>
            </li>
            <li>
              <a href="/catalog" className="hover:text-green-400">
                Catalog
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:text-green-400">
                Cart
              </a>
            </li>
            <li>
              <a href="/household" className="hover:text-green-400">
                Household
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-gray-300">Email: support@homenest.com</p>
          <p className="text-gray-300">Phone: +977 98XXXXXXXX</p>
          <p className="text-gray-300">Kathmandu, Nepal</p>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-gray-400">
        © {new Date().getFullYear()} HouseNest. All rights reserved.
      </div>
    </footer>
  );
}