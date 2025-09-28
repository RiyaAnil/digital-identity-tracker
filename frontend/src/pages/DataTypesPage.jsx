import { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import "../styles/styles.css";

export default function DataTypesPage() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [assignedData, setAssignedData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: accountsData, error: accErr } = await supabase
          .from("accounts")
          .select("*");
        if (accErr) throw accErr;
        setAccounts(accountsData);

        const { data: typesData, error: typeErr } = await supabase
          .from("data_types")
          .select("*");
        if (typeErr) throw typeErr;
        setDataTypes(typesData);

        const { data: assigned, error: assignErr } = await supabase
          .from("account_data")
          .select("account_id, data_types(id, type_name, sensitivity_weight)");
        if (assignErr) throw assignErr;
        setAssignedData(assigned || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const toggleType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const handleAssign = async () => {
    if (!selectedAccount || selectedTypes.length === 0) {
      setMessage("⚠️ Please select an account and at least one data type.");
      return;
    }

    const inserts = selectedTypes.map((typeId) => ({
      account_id: selectedAccount,
      data_type_id: typeId
    }));

    const { error } = await supabase
      .from("account_data")
      .upsert(inserts, { onConflict: ["account_id", "data_type_id"] });

    if (error) {
      console.error(error);
      setMessage(`❌ Failed to assign data types: ${error.message}`);
    } else {
      setMessage(`✅ Assigned selected data types successfully.`);
      setSelectedAccount("");
      setSelectedTypes([]);

      const { data: updatedAssigned } = await supabase
        .from("account_data")
        .select("account_id, data_types(id, type_name, sensitivity_weight)");
      setAssignedData(updatedAssigned || []);
    }
  };

  const calculateRisk = (accountId) => {
    const assigned = assignedData.filter((a) => a.account_id === accountId);
    const sum = assigned.reduce(
      (acc, cur) => acc + (cur.data_types?.sensitivity_weight || 0),
      0
    );
    return Math.min(sum, 100); // cap risk at 100
  };

  return (
    <div className="container">
      <h2>Assign Data Types to Account</h2>

      <div className="form-group">
        <div>
          <label>Choose Account: </label>
          <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
            <option value="" disabled>--Select an Account--</option>
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

        <div>
          <button className="assign-btn" onClick={handleAssign}>Assign</button>
        </div>
      </div>

      {message && <p className="message">{message}</p>}

      <h2>Accounts & Risk Scores</h2>
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
                {(() => {
                  const risk = calculateRisk(acc.id);
                  if (risk < 40) return <span className="risk-low">{risk}</span>;
                  if (risk < 70) return <span className="risk-medium">{risk}</span>;
                  return <span className="risk-high">{risk}</span>;
                })()}
              </td>
              <td>{acc.lastactive}</td>
              <td>{acc.status ? "Active" : "Inactive"}</td>
              <td>
                {assignedData
                  .filter((a) => a.account_id === acc.id)
                  .map((a) => (
                    <span key={a.data_types.id} className="badge">{a.data_types.type_name}</span>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
