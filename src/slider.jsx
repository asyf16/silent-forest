import PropTypes from "prop-types";

const Slider = ({ value, onChange }) => {
    const handleChange = (event) => {
      const newValue = event.target.value;
      if (onChange) {
        onChange(newValue); // Notify parent about the new value
      }
    };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "15px",
        left: "50%",
        transform: "translate(-50%, 0)",
        width: "320px", // Adjust width for label + slider
        textAlign: "center",
        display: "flex", // Flexbox for horizontal alignment
        alignItems: "center", // Vertically center label and slider
        gap: "10px", // Space between label and slider
      }}
    >
      <p
        style={{
          margin: "0",
          padding: "0",
          color: "white",
          fontFamily: "Lexend, serif",
          fontSize: "16px", // Adjust font size for consistency
          whiteSpace: "nowrap", // Prevent text wrapping
        }}
      >
        Sensitivity
      </p>
      <input
        type="range"
        min="50"
        max="200"
        value={value}
        onChange={handleChange}
        style={{
          width: "100%",
          WebkitAppearance: "none", // Remove default browser styling
          appearance: "none", // For cross-browser support
          height: "8px", // Track height
          background: "#ccc", // Track color
          borderRadius: "4px", // Rounded edges for the track
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
    value: PropTypes.string.isRequired, // Value comes from parent
    onChange: PropTypes.func.isRequired, // Callback to notify parent
  };