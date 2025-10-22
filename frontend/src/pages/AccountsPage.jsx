import { useState, useEffect } from "react";
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  fetchDataTypes,
  assignDataTypes,
} from "../api";
import DownloadButton from "../components/DownloadButton";
import "../styles/accounts.css";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedDataTypes, setSelectedDataTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    username: "",
    service_name: "",
    profile_id: "",
  });

  useEffect(() => {
    loadAccounts();
    loadDataTypes();
  }, []);

  const loadAccounts = async () => {
    try {
      const res = await fetchAccounts();
      setAccounts(res.data);
    } catch (err) {
      console.error("Error loading accounts:", err);
      setMessage("❌ Failed to load accounts");
    }
  };

  const loadDataTypes = async () => {
    try {
      const res = await fetchDataTypes();
      setDataTypes(res.data);
    } catch (err) {
      console.error("Error loading data types:", err);
    }
  };

  const handleCreate = () => {
    setEditingAccount(null);
    setFormData({ username: "", service_name: "", profile_id: "" });
    setSelectedDataTypes([]);
    setShowModal(true);
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      username: account.username,
      service_name: account.service_name,
      profile_id: account.profile_id || "",
    });
    setSelectedDataTypes(account.data_types?.map(dt => dt.id) || []);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDataType = (typeId) => {
    setSelectedDataTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.service_name) {
      setMessage("⚠️ Username and Service Name are required");
      return;
    }

    try {
      let accountId;
      
      if (editingAccount) {
        await updateAccount(editingAccount.id, formData);
        accountId = editingAccount.id;
        setMessage("✅ Account updated successfully");
      } else {
        const response = await createAccount(formData);
        accountId = response.data.id;
        setMessage("✅ Account created successfully");
      }

      if (selectedDataTypes.length > 0) {
        await assignDataTypes({
          account_id: accountId,
          data_type_ids: selectedDataTypes,
        });
      }

      setShowModal(false);
      loadAccounts();
      setFormData({ username: "", service_name: "", profile_id: "" });
      setSelectedDataTypes([]);
    } catch (err) {
      console.error("Error saving account:", err);
      setMessage(
        `❌ Failed to ${editingAccount ? "update" : "create"} account: ${
          err.response?.data?.detail || err.message
        }`
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) {
      return;
    }

    try {
      await deleteAccount(id);
      setMessage("✅ Account deleted successfully");
      loadAccounts();
    } catch (err) {
      console.error("Error deleting account:", err);
      setMessage(
        `❌ Failed to delete account: ${
          err.response?.data?.detail || err.message
        }`
      );
    }
  };

  return (
    <div className="accounts-container">
      <div className="accounts-header">
        <h1>Account Management</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <DownloadButton />
          <button className="btn-create" onClick={handleCreate}>
            + New Account
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.startsWith("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <div className="accounts-table-wrapper">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Service Name</th>
              <th>Profile ID</th>
              <th>Risk Score</th>
              <th>Data Shared</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No accounts found. Create your first account!
                </td>
              </tr>
            ) : (
              accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.username}</td>
                  <td>{acc.service_name}</td>
                  <td>{acc.profile_id || "-"}</td>
                  <td>
                    <span
                      className={`risk-badge ${
                        acc.risk_score < 40
                          ? "low"
                          : acc.risk_score < 70
                          ? "medium"
                          : "high"
                      }`}
                    >
                      {acc.risk_score || 0}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {acc.data_types?.map((dt) => (
                        <span key={dt.id} className="badge">
                          {dt.type_name}
                        </span>
                      ))}
                      {(!acc.data_types || acc.data_types.length === 0) && "-"}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${acc.is_active ? "active" : "inactive"}`}>
                      {acc.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    {acc.last_active
                      ? new Date(acc.last_active).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(acc)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(acc.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingAccount ? "Edit Account" : "Create New Account"}</h2>
            
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label>Service Name *</label>
              <input
                type="text"
                name="service_name"
                value={formData.service_name}
                onChange={handleInputChange}
                placeholder="e.g., Google, Facebook, Twitter"
              />
            </div>

            <div className="form-group">
              <label>Profile ID (Optional)</label>
              <input
                type="text"
                name="profile_id"
                value={formData.profile_id}
                onChange={handleInputChange}
                placeholder="Enter profile ID"
              />
            </div>

            <div className="form-group">
              <label>Data Types (Optional)</label>
              <div className="checkbox-group" style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "10px",
                maxHeight: "200px",
                overflowY: "auto",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#f9f9f9"
              }}>
                {dataTypes.map((dt) => (
                  <label key={dt.id} className="checkbox-label" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer"
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedDataTypes.includes(dt.id)}
                      onChange={() => toggleDataType(dt.id)}
                      style={{ cursor: "pointer" }}
                    />
                    <span>{dt.type_name}</span>
                  </label>
                ))}
                {dataTypes.length === 0 && (
                  <span style={{ color: "#666", fontStyle: "italic" }}>
                    No data types available
                  </span>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-submit"
                onClick={handleSubmit}
              >
                {editingAccount ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}