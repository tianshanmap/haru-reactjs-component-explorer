import { useState, } from 'react';
import './image_checkbox.module.css';

export default function ImageCheckbox({ 
  id, 
  imageSrc, 
  altText = "Selection Option", 
  label, 
  checked, 
  onChange 
}) {
  return (
    <label 
      htmlFor={id} 
      className={`image-checkbox-card ${checked ? 'is-checked' : ''}`}
    >
      {/* Hidden Native Checkbox for Accessibility */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e)}
        className="hidden-checkbox"
      />
      
      {/* Visual Container */}
      <div className="card-content">
        <div className="image-wrapper">
          <img src={imageSrc} alt={altText} className="card-image" />
          {/* Visual indicator shown on top of the image */}
          <div className="checkbox-indicator">
            {checked && <span className="checkmark">✓</span>}
          </div>
        </div>
        {label && <span className="card-label">{label}</span>}
      </div>
    </label>
  );
}