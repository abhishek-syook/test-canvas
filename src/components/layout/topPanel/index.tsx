import './index.scss';

import React, { FC } from 'react';
import HistoryToolbar from './components/historyToolbar';
import Toolbar from './components/toolbar';
interface Props {
	// any props that come into the component
	undo: () => void;
	redo: () => void;
	tool: string;
	setTool: (elementType: string) => string;
}

const TopPanel: FC<Props> = ({ undo, redo, tool, setTool }) => {
	return (
		<div className='topPanel'>
			<HistoryToolbar undo={undo} redo={redo} />
			<Toolbar selectedTool={tool} onChange={value => setTool(value)} />
		</div>
	);
};

export default TopPanel;
