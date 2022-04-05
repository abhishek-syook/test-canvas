import React from 'react';
import PropTypes from 'prop-types';

const ZoomToolbar = ({ onReset, currentScale, onZoomUpdate }) => {
	return (
		<div
			style={{
				left: 100,
				bottom: 0,
				padding: 10,
				display: 'flex',
				position: 'fixed'
			}}
		>
			<button onClick={e => onZoomUpdate(e, 53, false)}>-</button>
			<button onClick={onReset}>{currentScale}</button>
			<button onClick={e => onZoomUpdate(e, -53, false)}>+</button>
		</div>
	);
};

ZoomToolbar.propTypes = {
	currentScale: PropTypes.string.isRequired,
	onReset: PropTypes.func.isRequired,
	onZoomUpdate: PropTypes.func.isRequired
};

export default ZoomToolbar;
