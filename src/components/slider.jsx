import PropTypes from "prop-types";

const Slider = ({ value, onChange }) => (
  <div className="sensitivity-control">
    <label htmlFor="forest-volume">Noise Limit</label>
    <input id="forest-volume" type="range" min="25" max="255" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    <output htmlFor="forest-volume" className="sensitivity-value">{value} dB</output>
  </div>
);

Slider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Slider;
