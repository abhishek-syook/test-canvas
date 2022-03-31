import React from 'react';
import PropTypes from 'prop-types';

const HistoryToolbar = ({ undo, redo }) => {
	return (
		<div style={{ position: 'fixed', bottom: 0, padding: 10 }}>
			<button onClick={undo}>Undo</button>
			<button onClick={redo}>Redo</button>
		</div>
	);
};

HistoryToolbar.propTypes = {
	undo: PropTypes.func.isRequired,
	redo: PropTypes.func.isRequired
};

export default HistoryToolbar;
