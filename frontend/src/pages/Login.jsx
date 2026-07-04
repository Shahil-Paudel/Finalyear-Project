import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-sm px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="w-full rounded-md bg-brand-600 py-2 text-sm text-white hover:bg-brand-700">
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        No account? <Link to="/register" className="text-brand-700 underline">Register</Link>
      </p>
      <p className="mt-2 text-xs text-gray-400">
        Demo accounts (after running seed_demo): demo_household1 / demo1234
      </p>
    </div>
  );
}
