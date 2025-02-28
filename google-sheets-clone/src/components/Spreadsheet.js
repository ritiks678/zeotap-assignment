import React, { useState } from "react";
import "./Spreadsheet.css"; // Import CSS for styling

const Spreadsheet = () => {
  // Load data from local storage or create a 5x5 empty table
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("spreadsheet-data");
    return savedData ? JSON.parse(savedData) : Array.from({ length: 5 }, () => Array(5).fill(""));
  });

  // Function to handle changes in cell values
  const handleChange = (row, col, value) => {
    let newData = data.map((rowArr) => [...rowArr]); // Copy the table data

    // If user types a formula (e.g., =SUM(5,10,15))
    if (value.startsWith("=")) {
      let formula = value.substring(1); // Remove '='
      try {
        if (formula.startsWith("SUM(")) {
          let numbers = formula.match(/\d+/g).map(Number);
          newData[row][col] = numbers.reduce((a, b) => a + b, 0); // Calculate Sum
        } else if (formula.startsWith("AVERAGE(")) {
          let numbers = formula.match(/\d+/g).map(Number);
          newData[row][col] = numbers.reduce((a, b) => a + b, 0) / numbers.length; // Calculate Average
        } else if (formula.startsWith("MAX(")) {
          let numbers = formula.match(/\d+/g).map(Number);
          newData[row][col] = Math.max(...numbers); // Calculate Max
        } else if (formula.startsWith("MIN(")) {
          let numbers = formula.match(/\d+/g).map(Number);
          newData[row][col] = Math.min(...numbers); // Calculate Min
        } else {
          throw new Error("Invalid formula");
        }
      } catch (error) {
        newData[row][col] = "ERROR"; // Show error if formula is invalid
      }
    } else {
      newData[row][col] = value; // Update normal text values
    }

    setData(newData);
    localStorage.setItem("spreadsheet-data", JSON.stringify(newData)); // Save to local storage
  };

  // Function to add a new row dynamically
  const addRow = () => {
    const newRow = Array(data[0].length).fill("");
    const newData = [...data, newRow];
    setData(newData);
    localStorage.setItem("spreadsheet-data", JSON.stringify(newData));
  };

  // Function to add a new column dynamically
  const addColumn = () => {
    const newData = data.map(row => [...row, ""]);
    setData(newData);
    localStorage.setItem("spreadsheet-data", JSON.stringify(newData));
  };

  // Function to apply text formatting (bold, italic, color)
  const applyFormatting = (format) => {
    let selectedCell = document.activeElement;
    if (selectedCell && selectedCell.tagName === "INPUT") {
      selectedCell.classList.toggle(format);
    }
  };

  return (
    <div className="spreadsheet-container">
      <h2>Google Sheets Clone</h2>

      {/* Formatting Buttons */}
      <div className="formatting-buttons">
        <button onClick={() => applyFormatting("bold")}>Bold</button>
        <button onClick={() => applyFormatting("italic")}>Italic</button>
        <button onClick={() => applyFormatting("color-red")}>Red</button>
        <button onClick={() => applyFormatting("color-blue")}>Blue</button>
      </div>

      {/* Add Row & Column Buttons */}
      <div className="buttons-container">
        <button onClick={addRow}>➕ Add Row</button>
        <button onClick={addColumn}>➕ Add Column</button>
      </div>

      {/* Spreadsheet Table */}
      <table>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;
