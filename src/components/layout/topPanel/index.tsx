import React, { FC } from 'react';
import Toolbar from 'components/toolbar';

interface Props {
	// any props that come into the component
	tool: string;
	setTool: (elementType: string) => string;
}

const TopPanel: FC<Props> = ({ tool, setTool }) => {
	return <Toolbar selectedTool={tool} onChange={value => setTool(value)} />;
};

export default TopPanel;
