// File location: frontend/src/pages/RiskPage.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import RiskTable from "../components/RiskTable";

export default function RiskPage() {
  const [riskScores, setRiskScores] = useState([]);

  useEffect(() => {
    fetchRiskScores();
  }, []);

  const fetchRiskScores = async () => {
    const { data, error } = await supabase.from("risk_scores").select("*");
    if (error) console.error(error);
    else setRiskScores(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Accounts Risk Scores</h1>
      <RiskTable riskScores={riskScores} />
    </div>
  );
}
