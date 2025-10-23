// src/components/DataTypeCheckboxes.jsx
//This component displays all available data types as checkboxes. Users can select one or multiple types, and the selected IDs are sent back to the page to update the account’s data types
export default function DataTypeCheckboxes({ dataTypes, selected, onChange }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <label>Select Data Types:</label>
      <div>
        {dataTypes.map((dt) => (
          <label key={dt.id} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              value={dt.id}
              checked={selected.includes(dt.id)}
              onChange={() => {
                if (selected.includes(dt.id)) {
                  onChange(selected.filter((id) => id !== dt.id));
                } else {
                  onChange([...selected, dt.id]);
                }
              }}
            />
            {dt.type_name}
          </label>
        ))}
      </div>
    </div>
  );
}
