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
}

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
	onGridChange
}: LayoutProps) => {
	return (
		<section className="layout">
			<TopPanel tool={tool} setTool={setTool} />
			<section className="__body">
				<LeftPanel />
				<div className="__content">
					{children}
					<BottomPanel
						currentScale={currentScale}
						onZoomReset={onZoomReset}
						onZoomUpdate={onZoomUpdate}
						undo={undo}
						redo={redo}
						gridObj={gridObj}
						onGridChange={onGridChange}
					/>
				</div>
				<RightPanel />
			</section>
		</section>
	);
};

export default Layout;
