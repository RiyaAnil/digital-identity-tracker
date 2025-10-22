import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";

import AccountsPage from "./pages/AccountsPage";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
       
      </Routes>
    </Router>
  );
}

export default App;