// frontend/src/App.jsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import DataTypes from "./pages/DataTypesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/data-types" element={<DataTypes />} />
      </Routes>
    </Router>
  );
}

export default App;
