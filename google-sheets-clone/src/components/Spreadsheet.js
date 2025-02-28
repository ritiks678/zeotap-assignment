import React, { useState } from "react";
import "./Spreadsheet.css"; // We'll create this file for styling

const Spreadsheet = () => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("spreadsheet-data");
    return savedData ? JSON.parse(savedData) : Array.from({ length: 5 }, () => Array(5).fill(""));
  });

  const handleChange = (row, col, value) => {
    let newData = data.map((rowArr) => [...rowArr]); // Create a copy of the array

    // If user types a formula (e.g., =SUM(5,10,15))
    if (value.startsWith("=")) {
      let formula = value.substring(1); // Remove '='
      try {
        if (formula.startsWith("SUM(")) {
          let numbers = formula.match(/\d+/g).map(Number);
          newData[row][col] = numbers.reduce((a, b) => a + b, 0); // Sum
        } else if (formula.startsWith("AVERAGE(")) {
          let numbers = formula.match(/\d+/g).map(Number);
          newData[row][col] = numbers.reduce((a, b) => a + b, 0) / numbers.length; // Average
        } else if (formula.startsWith("MAX(")) {
          let numbers = formula.match(/\d+/g).map(Number);
          newData[row][col] = Math.max(...numbers); // Maximum
        } else if (formula.startsWith("MIN(")) {
          let numbers = formula.match(/\d+/g).map(Number);
          newData[row][col] = Math.min(...numbers); // Minimum
        } else {
          throw new Error("Invalid formula");
        }
      } catch (error) {
        newData[row][col] = "ERROR"; // Show error if formula is invalid
      }
    } else {
      newData[row][col] = value;
    }

    setData(newData);
    localStorage.setItem("spreadsheet-data", JSON.stringify(newData)); // ✅ Save to local storage
  };

  return (
    <div className="spreadsheet-container">
      <h2>Google Sheets Clone</h2>
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
