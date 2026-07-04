import { useState } from "react";

const PathSelect = ({ onChange }) => {

  const [options, setOptions] = useState([
    { value: 'none', label: 'none' },
    { value: '/', label: '/' },
  ]);
  
  const [selectedValue, setSelectedValue] = useState("Apple");

  const handleChange = async (event) => {
    setSelectedValue(event.target.value);
    let myOptions = await onChange(event.target.value);
    setOptions(myOptions);
  };

  return (
    <div>
      <label htmlFor="fruit-select">Choose a Path: </label>
      <select 
        id="fruit-select" 
        value={selectedValue} 
        onChange={handleChange}
      >
       {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <p>You selected: {selectedValue}</p>
    </div>
  );
}
export default PathSelect;