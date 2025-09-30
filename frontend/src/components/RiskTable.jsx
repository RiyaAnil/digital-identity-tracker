// frontend/src/components/RiskTable.jsx
export default function RiskTable({ riskScores }) {
  const getRiskClass = (score) => {
    if (score < 30) return "risk-low";
    if (score < 70) return "risk-medium";
    return "risk-high";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Service</th>
          <th>Risk Score</th>
          <th>Last Active</th>
          <th>Active</th>
        </tr>
      </thead>
      <tbody>
        {riskScores.map((r) => (
          <tr key={r.account_id}>
            <td>{r.username}</td>
            <td>{r.service}</td>
            <td className={getRiskClass(r.risk_score)}>{r.risk_score}</td>
            <td>{formatDate(r.last_active)}</td>
            <td>{r.active ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
