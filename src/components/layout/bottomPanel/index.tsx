import './index.scss';
import React from 'react';
import GridToolbar from './components/gridToolbar';
import ZoomToolbar from './components/zoomToolbar';

interface BottomPanelProps {
	currentScale: string;
	onZoomReset: () => void;
	onZoomUpdate: () => void;
	gridObj: { isEnable: boolean; snapSize: number };
	onGridChange: () => void;
}

const BottomPanel = ({
	currentScale,
	onZoomReset,
	onZoomUpdate,
	gridObj,
	onGridChange
}: BottomPanelProps) => {
	return (
		<div className="bottomPanel">
			<ZoomToolbar currentScale={currentScale} onReset={onZoomReset} onZoomUpdate={onZoomUpdate} />
			<GridToolbar gridObj={gridObj} onChange={onGridChange} />
		</div>
	);
};

export default BottomPanel;
