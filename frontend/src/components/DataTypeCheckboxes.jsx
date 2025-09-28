// src/components/DataTypeCheckboxes.jsx
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
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, dt.id]);
                else onChange(selected.filter((id) => id !== dt.id));
              }}
            />
            {dt.name}
          </label>
        ))}
      </div>
    </div>
  );
}
