import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to accounts page after login
    navigate("/accounts");
  };

  return (
    <div className="simple-landing">
      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>

      <div className="center-content">
        <h1 className="landing-title">Digital Identity Tracker</h1>
        <p className="landing-tagline">
          Secure, Simplify and Streamline your accounts
        </p>
      </div>
    </div>
  );
}