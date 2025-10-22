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
        
      </div>
    </nav>
  );
}