import './index.scss';

import React from 'react';

import LeftPanel from './leftPanel';
import TopPanel from './topPanel';
import RightPanel from './rightPanel';
import BottomPanel from './bottomPanel';
import { ElementType } from 'types';

interface LayoutProps {
	children: React.ReactNode;

	// leftPanel
	tool: string;
	setTool: (elementType: string) => void;
	onElementSelect: (element: ElementType) => void;

	// bottomPanel - zoom tool
	currentScale: string;
	onZoomReset: () => void;
	onZoomUpdate: (
		event: React.MouseEvent<HTMLButtonElement>,
		zoomValue: number,
		mouseWheel?: boolean
	) => void;
	// bottomPanel - history tools

	undo: () => void;
	redo: () => void;
	// bottomPanel - grid tool

	gridObj: { isEnable: boolean; snapSize: number };
	onGridChange: (newGridObj: { isEnable: boolean; snapSize: number }) => void;

	// rightPanel - selected element
	element: null | ElementType;
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
