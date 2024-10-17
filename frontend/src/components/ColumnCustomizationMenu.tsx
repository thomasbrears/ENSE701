import { useState } from "react";

interface ColumnCustomizationProps {
  availableColumns: { key: string, label: string }[];
  selectedColumns: string[];
  onColumnChange: (updatedColumns: string[]) => void;
}

const ColumnCustomizationMenu: React.FC<ColumnCustomizationProps> = ({ availableColumns, selectedColumns, onColumnChange }) => {
  const handleCheckboxChange = (columnKey: string) => {
    const isChecked = selectedColumns.includes(columnKey);
    let updatedColumns;

    if (isChecked) {
      updatedColumns = selectedColumns.filter((key) => key !== columnKey);
    } else {
      updatedColumns = [...selectedColumns, columnKey];
    }

    onColumnChange(updatedColumns);
  };

  return (
    <div>
      <h3>Customize Columns</h3>
      <ul style={{ display: "flex", listStyleType: "none", paddingLeft: 0 }}>
        {availableColumns.map(({ key, label }) => (
          <li key={key} style={{ marginRight: "20px" }}>
            <label>
              <input
                type="checkbox"
                checked={selectedColumns.includes(key)}
                onChange={() => handleCheckboxChange(key)}
              />
              {label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColumnCustomizationMenu;
