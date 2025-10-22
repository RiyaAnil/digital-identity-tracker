import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import DataTypes from "./pages/DataTypesPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateProfile from "./pages/CreateProfile";
import Navbar from "./components/Navbar";

function AppWrapper() {
  const location = useLocation();
  const showNavbar = !["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/data-types" element={<DataTypes />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-profile" element={<CreateProfile />} />
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