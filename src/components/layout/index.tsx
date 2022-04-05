import './index.scss';
import React, { FC } from 'react';
import LeftPanel from './leftPanel';
import TopPanel from './topPanel';
import RightPanel from './rightPanel';

interface Props {
	children: Node;
	tool: string;
	setTool: (elementType: string) => string;
}

const Layout: FC<Props> = ({ children, tool, setTool }) => {
	return (
		<section className="layout">
			<TopPanel tool={tool} setTool={setTool} />
			<section className="__body">
				<LeftPanel />
				{children}
				<RightPanel />
			</section>
		</section>
	);
};

export default Layout;
