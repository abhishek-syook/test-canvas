import React from 'react';

const zoomToolbar = ({ context, reset, scale, handleZoom }) => {
	return (
		<div style={{ position: 'fixed', bottom: 40, padding: 10, display: 'flex' }}>
			<button onClick={e => handleZoom(e, 53, false)}>-</button>
			<button onClick={() => context && reset(context)}>{Math.round(scale * 10) * 10}%</button>
			<button onClick={e => handleZoom(e, -53, false)}>+</button>
		</div>
	);
};

export default zoomToolbar;
