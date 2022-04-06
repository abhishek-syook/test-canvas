import React from 'react';
import PropTypes from 'prop-types';

const ZoomToolbar = ({ onReset, currentScale, onZoomUpdate }) => {
	return (
		<div>
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
