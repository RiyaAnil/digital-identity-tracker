import { useState, useEffect } from "react";
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../api";
import "../styles/accounts.css";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    service_name: "",
    profile_id: "",
  });

  // Load accounts on mount
  useEffect(() => {
    loadAccounts();
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

  // Open modal for creating new account
  const handleCreate = () => {
    setEditingAccount(null);
    setFormData({ username: "", service_name: "", profile_id: "" });
    setShowModal(true);
  };

  // Open modal for editing existing account
  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      username: account.username,
      service_name: account.service_name,
      profile_id: account.profile_id || "",
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.service_name) {
      setMessage("⚠️ Username and Service Name are required");
      return;
    }

    try {
      if (editingAccount) {
        // Update existing account
        await updateAccount(editingAccount.id, formData);
        setMessage("✅ Account updated successfully");
      } else {
        // Create new account
        await createAccount(formData);
        setMessage("✅ Account created successfully");
      }

      setShowModal(false);
      loadAccounts();
      setFormData({ username: "", service_name: "", profile_id: "" });
    } catch (err) {
      console.error("Error saving account:", err);
      setMessage(
        `❌ Failed to ${editingAccount ? "update" : "create"} account: ${
          err.response?.data?.detail || err.message
        }`
      );
    }
  };

  // Delete account with confirmation
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
        <button className="btn-create" onClick={handleCreate}>
          + New Account
        </button>
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
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
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

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingAccount ? "Edit Account" : "Create New Account"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  required
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
                  required
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

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingAccount ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}