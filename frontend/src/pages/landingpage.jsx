import React from "react";
import "../styles/styles.css";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/login"; // change path if your login route differs
  };

  return (
    <div className="simple-landing">
      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>

      <div className="center-content">
        <h1 className="landing-title">Digital Identity Tracker</h1>
        <p className="landing-tagline">
          One dashboard to track your digital identity and data risks.
        </p>
      </div>
    </div>
  );
}
