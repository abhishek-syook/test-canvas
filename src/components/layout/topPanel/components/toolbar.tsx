import './toolbar.scss';

import React, { FC } from 'react';
import { ELEMENT_TYPES } from 'constants/index';
import ToolIcons from 'assets/toolIcons';

interface Props {
	selectedTool: string;
	onChange: (elementType: string) => string;
}

const Toolbar: FC<Props> = ({ selectedTool, onChange }) => {
	return (
		<div className="topPanelSection">
			<div className="__toolbar">
				{Object.values(ELEMENT_TYPES).map((element: string) => {
					return (
						<div key={element} title={element[0].toUpperCase() + element.slice(1)}>
							<button
								onClick={() => onChange(element)}
								className={selectedTool === element ? '__selected' : '__notSelected'}
							>
								<ToolIcons name={element} />
							</button>
						</div>
					);
				})}
			</div>
			<h5 className="__toolText">Tool</h5>
		</div>
	);
};

export default Toolbar;
