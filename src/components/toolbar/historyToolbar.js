import React from "react";

const HistoryToolbar = ({ undo, redo }) => {
  return (
    <div style={{ position: "fixed", bottom: 0, padding: 10 }}>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>
  );
};

export default HistoryToolbar;
