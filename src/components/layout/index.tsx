import './index.scss';
import React, { FC } from 'react';
import LeftPanel from './leftPanel';
import TopPanel from './topPanel';
import RightPanel from './rightPanel';
import BottomPanel from './bottomPanel';

interface Props {
	children: Node;
	tool: string;
	setTool: (elementType: string) => string;

	// bottom panel
	currentScale: string;
	onZoomReset: () => void;
	onZoomUpdate: () => void;
	undo: () => void;
	redo: () => void;
	gridObj: { isEnable: boolean; snapSize: number };
	onGridChange: () => void;
}

const Layout: FC<Props> = ({
	children,
	tool,
	setTool,
	currentScale,
	onZoomReset,
	onZoomUpdate,
	undo,
	redo,
	gridObj,
	onGridChange
}) => {
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
