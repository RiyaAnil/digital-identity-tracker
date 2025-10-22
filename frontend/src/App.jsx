import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import DataTypesPage from "./pages/DataTypesPage";
import AccountsPage from "./pages/AccountsPage";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/data-types" element={<DataTypesPage />} />
      </Routes>
    </Router>
  );
}

export default App;