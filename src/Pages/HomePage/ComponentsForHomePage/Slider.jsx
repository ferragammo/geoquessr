import React, { useState } from 'react';
import './Slider.css';

const CustomSlider = ({ onRoundsChange }) => {
  const [value, setValue] = useState(3);

  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setValue(newValue);
    onRoundsChange(newValue); 
  };

  return (
    <div className="slider-container">
      <input
        type="range"
        min="3"
        max="10"
        value={value}
        onChange={handleSliderChange}
        className="slider"
        style={{
          background: `linear-gradient(to right, rgb(94, 255, 0) ${(value - 3) * 100 / 7}%, rgb(67, 61, 73) ${(value - 3) * 100 / 7}%)`,
        }}
      />
      <div className="slider-value">{value}</div>
    </div>
  );
};

export default CustomSlider;
