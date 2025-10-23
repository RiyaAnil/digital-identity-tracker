// src/components/AccountSelector.jsx
//This component shows a dropdown menu of accounts. The user can select an account, and the selected account ID is sent back to the page to perform actions like assigning data types or viewing details.
export default function AccountSelector({ accounts, selected, onChange }) {
  return (
    <div>
      <label>Choose Account: </label>
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">--Select an Account--</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.service_name} ({acc.username})
          </option>
        ))}
      </select>
    </div>
  );
}
