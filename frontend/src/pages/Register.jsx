import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/register", form);
      alert("Registered successfully!");
      navigate("/login"); // ✅ Redirect to login
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert("Registration failed. Try a different email or check your input.");
    }
  };

    return (
      <div className="auth-page">
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
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
      <button type="submit">Register</button>
            </form>
            </div>
  );
};

export default Register;