import { useState, useEffect } from "react";
import { fetchAccounts } from "../api/"; // call backend
import RiskTable from "../components/RiskTable";

export default function RiskPage() {
  const [riskScores, setRiskScores] = useState([]);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await fetchAccounts();
        // Map backend response to RiskTable format
        const formatted = res.data.map((acc) => ({
          account_id: acc.id,
          username: acc.username,
          service: acc.service_name,
          risk_score: acc.risk_score,
          last_active: acc.last_active,
          active: acc.is_active,
        }));
        setRiskScores(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    loadAccounts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Accounts Risk Scores</h1>
      <RiskTable riskScores={riskScores} />
    </div>
  );
}
