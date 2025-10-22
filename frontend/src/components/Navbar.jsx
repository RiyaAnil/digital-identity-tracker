import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
  <Link to="/">Home</Link>
  <Link to="/data-types">Data Types</Link>
  <Link to="/login">Login</Link>
  
  
</nav>
  );
}