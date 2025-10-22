import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {

    window.location.href = "/login";
  };

  const handleRegister = () => {
    window.location.href = "/register";

    // Navigate to accounts page after login
    navigate("/accounts");

  };

  return (
    <div className="simple-landing">
      {/* Top corners */}
      <button className="corner-btn top-left" onClick={handleRegister}>
        Register
      </button>
      <button className="corner-btn top-right" onClick={handleLogin}>
        Login
      </button>

      {/* Centered content */}
      <div className="center-content">
        <h1 className="landing-title">Digital Identity Tracker</h1>
        <p className="landing-tagline">
          Secure, Simplify and Streamline your accounts
        </p>
      </div>
    </div>
  );
}