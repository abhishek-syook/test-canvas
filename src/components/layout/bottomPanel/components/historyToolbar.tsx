import React from 'react';

interface HistoryToolbarProps {
	undo: () => void;
	redo: () => void;
}

const HistoryToolbar = ({ undo, redo }: HistoryToolbarProps) => {
	return (
		<div>
			<button onClick={undo}>Undo</button>
			<button onClick={redo}>Redo</button>
		</div>
	);
};

export default HistoryToolbar;
