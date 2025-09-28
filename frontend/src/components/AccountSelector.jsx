// src/components/AccountSelector.jsx
export default function AccountSelector({ accounts, selected, onChange }) {
  return (
    <div>
      <label>Choose Account: </label>
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">--Select--</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.username}
          </option>
        ))}
      </select>
    </div>
  );
}
