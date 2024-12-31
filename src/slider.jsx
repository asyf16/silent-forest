import PropTypes from "prop-types";

const Slider = ({ value, onChange }) => {
    const handleChange = (event) => {
      const newValue = event.target.value;
      if (onChange) {
        onChange(newValue); 
      }
    };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "15px",
        left: "50%",
        transform: "translate(-50%, 0)",
        width: "320px", 
        textAlign: "center",
        display: "flex", 
        alignItems: "center",
        gap: "10px",
      }}
    >
      <p
        style={{
          margin: "0",
          padding: "0",
          color: "white",
          fontFamily: "Lexend, serif",
          fontSize: "16px", 
          whiteSpace: "nowrap",
        }}
      >
        Max Volume
      </p>
      <input
        type="range"
        min="50"
        max="200"
        value={value}
        onChange={handleChange}
        style={{
          width: "100%",
          WebkitAppearance: "none", 
          appearance: "none", 
          height: "8px",
          background: "#ccc", 
          borderRadius: "4px",
          outline: "none",
        }}
      />
      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; /* Override default thumb styling */
            appearance: none;
            width: 20px; /* Thumb width */
            height: 20px; /* Thumb height */
            background: white; /* Thumb color */
            border: 1px solid #ccc; /* Thumb border */
            border-radius: 50%; /* Rounded thumb */
            cursor: pointer; /* Pointer cursor on hover */
          }

          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 50%;
            cursor: pointer;
          }

          input[type="range"]::-ms-thumb {
            width: 20px;
            height: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 50%;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default Slider;
Slider.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };