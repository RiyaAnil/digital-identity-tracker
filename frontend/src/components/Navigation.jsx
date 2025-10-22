import { Link, useLocation } from "react-router-dom";
import "../styles/navigation.css";

export default function Navigation() {
  const location = useLocation();
  
  // Hide navigation on landing page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Digital Identity Tracker
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/accounts"
              className={`nav-link ${location.pathname === "/accounts" ? "active" : ""}`}
            >
              Accounts
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/data-types"
              className={`nav-link ${location.pathname === "/data-types" ? "active" : ""}`}
            >
              Data Types
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}