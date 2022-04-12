import './index.scss';

import React from 'react';

import LeftPanel from './leftPanel';
import TopPanel from './topPanel';
import RightPanel from './rightPanel';
import BottomPanel from './bottomPanel';

interface LayoutProps {
	children: Node;

	// leftPanel
	tool: string;
	setTool: (elementType: string) => string;

	// bottomPanel - zoom tool
	currentScale: string;
	onZoomReset: () => void;
	onZoomUpdate: () => void;
	// bottomPanel - history tools

	undo: () => void;
	redo: () => void;
	// bottomPanel - grid tool

	gridObj: { isEnable: boolean; snapSize: number };
	onGridChange: () => void;

	// rightPanel - selected element
	element: null | {
		_id: string;
		type: string;
		coordinates: { x: number; y: number }[];
		elementType: string;
		label: string;
		labelCoordinates: {
			x: null;
			y: null;
		};
		zoneId: string;
		elementProperties: {
			fill: string;
			fillOpacity: number;
			stroke: string;
			strokeWidth: number;
		};
	};
}

const mapData = {
	_id: '61a6028b49fac1004c8d25e2',
	type: 'map',
	coordinates: [
		{
			x: 90,
			y: 5
		},
		{
			x: 105,
			y: 5
		},
		{
			x: 105,
			y: 40
		},
		{
			x: 90,
			y: 40
		},
		{
			x: 90,
			y: 5
		}
	],
	elementType: 'polygon',
	label: 'PM store right 2',
	labelCoordinates: {
		x: null,
		y: null
	},
	zoneId: '61a6028b49fac1004c8d25b4',
	__v: 0,
	createdAt: '2021-11-30T10:52:59.828Z',
	updatedAt: '2022-02-16T06:39:38.632Z',
	elementProperties: {
		fill: '#000',
		fillOpacity: 0.3,
		stroke: 'rgba(0,0,0,1)',
		strokeWidth: 1
	}
};
const Layout = ({
	children,

	// leftPanel
	tool,
	setTool,

	// bottomPanel - zoom tool
	currentScale,
	onZoomReset,
	onZoomUpdate,

	// bottomPanel - history tools
	undo,
	redo,

	// bottomPanel - grid tool
	gridObj,
	onGridChange,

	// rightPanel - selected element
	element
}: LayoutProps) => {
	return (
		<section className="layout">
			<TopPanel tool={tool} setTool={setTool} undo={undo} redo={redo} />
			<section className="__body">
				<LeftPanel />
				<div className="__content">
					{children}
					<BottomPanel
						currentScale={currentScale}
						onZoomReset={onZoomReset}
						onZoomUpdate={onZoomUpdate}
						gridObj={gridObj}
						onGridChange={onGridChange}
					/>
				</div>
				<RightPanel element={element ? mapData : null} />
			</section>
		</section>
	);
};

export default Layout;
