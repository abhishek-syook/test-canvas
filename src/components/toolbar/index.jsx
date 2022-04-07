import React from 'react';
import PropTypes from 'prop-types';
import { ELEMENT_TYPES } from '../../constants';
import ToolIcons from 'assets/toolIcons';

const Toolbar = ({ selectedTool, onChange }) => {
	return (
		<div style={{ position: 'fixed', display: 'flex' }}>
			{Object.values(ELEMENT_TYPES).map(element => {
				return (
					<div key={element} title={element[0].toUpperCase() + element.slice(1)}>
						<button
							onClick={() => onChange(element)}
							style={
								selectedTool === element.type
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

Toolbar.propTypes = {
	selectedTool: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};

export default Toolbar;
