import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/landingpage";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateProfile from "./pages/CreateProfile";
import AccountsPage from "./pages/AccountsPage";
import Navbar from "./components/Navbar";
import Navigation from "./components/Navigation";

function AppWrapper() {
  const location = useLocation();
  const showNavbar = !["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {/* Optional: <Navigation /> if you want both navs */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
       
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="*" element={<h2 style={{ textAlign: "center" }}>Page not found</h2>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}