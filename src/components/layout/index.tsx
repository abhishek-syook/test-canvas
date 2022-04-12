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
	onElementSelect: () => void;

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
		coordinates:
			| { x: number; y: number }[]
			| {
					x: number;
					y: number;
					z: number;
			  };
		elementType?: string;
		label?: string;
		labelCoordinates?: {
			x: null;
			y: null;
		};
		zoneId?: string;
		clusterId?:
			| string
			| {
					labels: any;
					_id: string;
					name: string;
					description: string;
					zoneId: {
						labels: any;
						_id: string;
						name: string;
						description: string;
					};
			  };
		elementProperties?: {
			fill: string;
			fillOpacity: number;
			stroke: string;
			strokeWidth: number;
		};
		name?: string;
		hardwareType?: string;
		identifierKey?: string;
		identifierValue?: string;
		plotCoordinates?: {
			x: number;
			y: number;
			z: number;
		};
	};
}

const Layout = ({
	children,

	// leftPanel
	tool,
	setTool,
	onElementSelect,

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
				<LeftPanel onElementSelect={onElementSelect} />
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
				<RightPanel element={element} />
			</section>
		</section>
	);
};

export default Layout;
