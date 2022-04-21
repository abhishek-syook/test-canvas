import './toolbar.scss';

import React from 'react';
import { ELEMENT_EDIT_TYPES } from 'constants/index';
import EditIcons from 'assets/editIcons';

interface HistoryToolbarProps {
	undo: () => void;
	redo: () => void;
}

const HistoryToolbar = ({ undo, redo }: HistoryToolbarProps) => {
	return (
		<div className="topPanelSection" style={{ width: '80px' }}>
			<div className="__toolbar" style={{ width: '80px' }}>
				{Object.values(ELEMENT_EDIT_TYPES).map(element => {
					return (
						<div key={element} title={element[0].toUpperCase() + element.slice(1)}>
							<button onClick={element === 'undo' ? undo : redo} className="__default">
								<EditIcons name={element} />
							</button>
						</div>
					);
				})}
			</div>
			<h5 className="__toolText">Edit</h5>
		</div>
	);
};

export default HistoryToolbar;
