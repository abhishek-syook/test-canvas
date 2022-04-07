import React, { FC } from 'react';
import { ELEMENT_TYPES } from '../../constants';
import ToolIcons from 'assets/toolIcons';

interface Props {
	selectedTool: string;
	onChange: (elementType: string) => string;
}

const Toolbar: FC<Props> = ({ selectedTool, onChange }) => {
	return (
		<div style={{ position: 'fixed', display: 'flex' }}>
			{Object.values(ELEMENT_TYPES).map(element => {
				return (
					<div key={element} title={element[0].toUpperCase() + element.slice(1)}>
						<button
							onClick={() => onChange(element)}
							style={
								selectedTool === element
									? { backgroundColor: '#F5F4FF', color: '#4724D8' }
									: { backgroundColor: '#FDFDFD' }
							}
						>
							<ToolIcons name={element} />
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default Toolbar;
