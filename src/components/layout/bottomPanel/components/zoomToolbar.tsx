import React from 'react';

interface ZoomToolbarProps {
	currentScale: string;
	onReset: () => void;
	onZoomUpdate: (
		event: React.MouseEvent<HTMLButtonElement>,
		zoomValue: number,
		mouseWheel?: boolean
	) => void;
}

const ZoomToolbar = ({ onReset, currentScale, onZoomUpdate }: ZoomToolbarProps) => {
	return (
		<div>
			<button onClick={e => onZoomUpdate(e, 53, false)}>-</button>
			<button onClick={onReset}>{currentScale}</button>
			<button onClick={e => onZoomUpdate(e, -53, false)}>+</button>
		</div>
	);
};

export default ZoomToolbar;
