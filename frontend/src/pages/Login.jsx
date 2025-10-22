import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", form);
      const token = res.data.access_token;
      setAuthToken(token);
      localStorage.setItem("token", token);
      alert("Logged in successfully!");
      window.location.href = "/accounts"; // ✅ Redirect to dashboard
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check your credentials.");
    }
  };

  return (
      <div className="auth-page">
          <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* 🔹 Forgot Password Button */}
      <div>
        <button onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
}