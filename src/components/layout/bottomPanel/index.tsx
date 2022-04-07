import './index.scss';
import React from 'react';
import GridToolbar from './components/gridToolbar';
import HistoryToolbar from './components/historyToolbar';
import ZoomToolbar from './components/zoomToolbar';

interface BottomPanelProps {
	currentScale: string;
	onZoomReset: () => void;
	onZoomUpdate: () => void;
	undo: () => void;
	redo: () => void;
	gridObj: { isEnable: boolean; snapSize: number };
	onGridChange: () => void;
}

const BottomPanel = ({
	currentScale,
	onZoomReset,
	onZoomUpdate,
	undo,
	redo,
	gridObj,
	onGridChange
}: BottomPanelProps) => {
	return (
		<div className="bottomPanel">
			<ZoomToolbar currentScale={currentScale} onReset={onZoomReset} onZoomUpdate={onZoomUpdate} />
			<HistoryToolbar undo={undo} redo={redo} />
			<GridToolbar gridObj={gridObj} onChange={onGridChange} />
		</div>
	);
};

export default BottomPanel;
