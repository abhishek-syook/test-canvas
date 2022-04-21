import './index.scss';
import React from 'react';
import GridToolbar from './components/gridToolbar';
import ZoomToolbar from './components/zoomToolbar';

interface BottomPanelProps {
	currentScale: string;
	onZoomReset: () => void;
	onZoomUpdate: (
		event: React.MouseEvent<HTMLButtonElement>,
		zoomValue: number,
		mouseWheel?: boolean
	) => void;
	gridObj: { isEnable: boolean; snapSize: number };
	onGridChange: (newGridObj: { isEnable: boolean; snapSize: number }) => void;
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
