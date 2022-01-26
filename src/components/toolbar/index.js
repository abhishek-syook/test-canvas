import { ELEMENT_TYPES } from "../../constants";
import React from "react";

const Toolbar = ({ selectedTool, onChange }) => {
  return (
    <div style={{ position: "fixed" }}>
      <input
        type="radio"
        id="selection"
        checked={selectedTool === ELEMENT_TYPES.SELECTION}
        onChange={() => onChange(ELEMENT_TYPES.SELECTION)}
      />
      <label htmlFor="selection">Selection</label>

      <input
        type="radio"
        id="line"
        checked={selectedTool === ELEMENT_TYPES.LINE}
        onChange={() => onChange(ELEMENT_TYPES.LINE)}
      />
      <label htmlFor="line">Line</label>

      <input
        type="radio"
        id="rectangle"
        checked={selectedTool === ELEMENT_TYPES.RECTANGLE}
        onChange={() => onChange(ELEMENT_TYPES.RECTANGLE)}
      />
      <label htmlFor="rectangle">Rectangle</label>

      <input
        type="radio"
        id="pencil"
        checked={selectedTool === ELEMENT_TYPES.PENCIL}
        onChange={() => onChange(ELEMENT_TYPES.PENCIL)}
      />
      <label htmlFor="pencil">Pencil</label>

      <input
        type="radio"
        id="text"
        checked={selectedTool === ELEMENT_TYPES.TEXT}
        onChange={() => onChange(ELEMENT_TYPES.TEXT)}
      />
      <label htmlFor="text">Text</label>

      <input
        type="radio"
        id="polygon"
        checked={selectedTool === ELEMENT_TYPES.POLYGON}
        onChange={() => onChange(ELEMENT_TYPES.POLYGON)}
      />
      <label htmlFor="polygon">Polygon</label>
    </div>
  );
};

export default Toolbar;
