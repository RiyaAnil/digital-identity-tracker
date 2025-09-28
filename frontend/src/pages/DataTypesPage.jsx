import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

export default function DataTypes() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [assignedData, setAssignedData] = useState([]); // account_data
  const [message, setMessage] = useState("");

  // Fetch accounts, data types, and assigned data
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
          .select("account_id, data_types(type_name, sensitivity_weight)");
        if (assignErr) throw assignErr;
        setAssignedData(assigned);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Toggle checkbox selection
  const toggleType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  // Assign selected data types to account
  const handleAssign = async () => {
    if (!selectedAccount || selectedTypes.length === 0) {
      setMessage("⚠️ Please select an account and at least one data type.");
      return;
    }

    const accountId = Number(selectedAccount);

    // Insert into account_data (upsert to avoid duplicates)
    const inserts = selectedTypes.map((typeId) => ({
      account_id: accountId,
      data_type_id: typeId,
    }));

    const { error } = await supabase.from("account_data").upsert(inserts);
    if (error) {
      console.error(error);
      setMessage("❌ Failed to assign data types.");
    } else {
      setMessage(`✅ Assigned selected data types successfully.`);
      setSelectedAccount("");
      setSelectedTypes([]);

      // Refresh assigned data
      const { data: updatedAssigned } = await supabase
        .from("account_data")
        .select("account_id, data_types(type_name, sensitivity_weight)");
      setAssignedData(updatedAssigned);
    }
  };

  // Get assigned type names for an account
  const getAssignedTypes = (accountId) => {
    return assignedData
      .filter((a) => a.account_id === accountId)
      .map((a) => a.data_types.type_name)
      .join(", ");
  };

  // Calculate risk score based on sensitivity weights
  const calculateRisk = (accountId) => {
    const assigned = assignedData.filter((a) => a.account_id === accountId);
    const sum = assigned.reduce(
      (acc, cur) => acc + (cur.data_types?.sensitivity_weight || 0),
      0
    );
    return sum; // optionally cap at 100
  };

  return (
    <div className="container">
      <h2>Assign Data Types to Account</h2>

      <label>Choose Account: </label>
      <select
        value={selectedAccount}
        onChange={(e) => setSelectedAccount(e.target.value)}
      >
        <option value="">--Select--</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id.toString()}>
            {acc.servicename}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "10px" }}>
        {dataTypes.map((dt) => (
          <label key={dt.id} style={{ marginRight: "15px" }}>
            <input
              type="checkbox"
              checked={selectedTypes.includes(dt.id)}
              onChange={() => toggleType(dt.id)}
            />
            {dt.type_name}
          </label>
        ))}
      </div>

      <button style={{ marginTop: "10px" }} onClick={handleAssign}>
        Assign
      </button>

      {message && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>}

      <h2 style={{ marginTop: "30px" }}>Accounts & Risk Scores</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
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
              <td>{acc.servicename}</td>
              <td>{calculateRisk(acc.id)}</td>
              <td>{acc.lastactive}</td>
              <td>{acc.status ? "Active" : "Inactive"}</td>
              <td>{getAssignedTypes(acc.id) || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
