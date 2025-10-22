import { useState, useEffect } from "react";
import { fetchAccounts, fetchDataTypes, assignDataTypes } from "../api";
import DownloadButton from "../components/DownloadButton";
import "../styles/styles.css";

export default function DataTypesPage() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [message, setMessage] = useState("");

  // Load accounts and data types from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const accRes = await fetchAccounts();
        setAccounts(accRes.data);

        const typeRes = await fetchDataTypes();
        setDataTypes(typeRes.data);
      } catch (err) {
        console.error(err);
       
      }
    };
    loadData();
  }, []);

  // Toggle data type selection
  const toggleType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  // Assign selected data types to the selected account
  const handleAssign = async () => {
    if (!selectedAccount || selectedTypes.length === 0) {
      setMessage("⚠️ Please select an account and at least one data type.");
      return;
    }

    try {
      await assignDataTypes({
        account_id: selectedAccount,
        data_type_ids: selectedTypes,
      });

      setMessage("✅ Assigned selected data types successfully.");
      setSelectedAccount("");
      setSelectedTypes([]);

      // Refresh accounts to get updated risk scores and data types
      const accRes = await fetchAccounts();
      setAccounts(accRes.data);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Failed: ${err.response?.data?.detail || err.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Assign Data Types to Account</h2>

      <div className="form-group">
        <div>
          <label>Choose Account: </label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="">--Select an Account--</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.service_name} ({acc.username})
              </option>
            ))}
          </select>
        </div>

        <div className="checkbox-group">
          {dataTypes.map((dt) => (
            <label key={dt.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedTypes.includes(dt.id)}
                onChange={() => toggleType(dt.id)}
              />
              {dt.type_name}
            </label>
          ))}
        </div>

        <button className="assign-btn" onClick={handleAssign}>
          Assign
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="section-header">
        <h2>Accounts & Risk Scores</h2>
        <DownloadButton />
      </div>

      <table className="account-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Service</th>
            <th>Risk Score</th>
            <th>Last Active</th>
            <th>Status</th>
            <th>Data Types</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id}>
              <td>{acc.username}</td>
              <td>{acc.service_name}</td>
              <td>
                <span
                  className={
                    acc.risk_score < 40
                      ? "risk-low"
                      : acc.risk_score < 70
                      ? "risk-medium"
                      : "risk-high"
                  }
                >
                  {acc.risk_score}
                </span>
              </td>
              <td>
                {acc.last_active
                  ? new Date(acc.last_active).toLocaleString()
                  : "-"}
              </td>
              <td>{acc.is_active ? "Active" : "Inactive"}</td>
              <td>
                {acc.data_types?.map((dt) => (
                  <span key={dt.id} className="badge">
                    {dt.type_name}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}