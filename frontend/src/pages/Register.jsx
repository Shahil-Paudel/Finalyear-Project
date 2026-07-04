import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", household_name: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const detail = err?.response?.data;
      setError(detail ? JSON.stringify(detail) : "Registration failed.");
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-sm px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Create your household</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["username", "email", "password", "household_name"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field.replace("_", " ")}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm capitalize"
          />
        ))}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="w-full rounded-md bg-brand-600 py-2 text-sm text-white hover:bg-brand-700">
          Create account
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Already have an account? <Link to="/login" className="text-brand-700 underline">Log in</Link>
      </p>
    </div>
  );
}
