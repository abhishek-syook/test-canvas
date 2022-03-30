import React from "react";

const zoomToolbar = ({context, reset, scale}) => {
    return (
        <div style={{ position: "fixed", bottom: 40, padding: 10, display: "flex" }}>
            <button>-</button>
            <button onClick={() => context && reset(context)}>{Math.round(scale * 10) * 10}%</button>
            <button>+</button>
        </div>
    )
}

export default zoomToolbar