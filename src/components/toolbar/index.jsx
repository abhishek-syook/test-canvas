import React from 'react';
import PropTypes from 'prop-types';
import { ELEMENT_TYPES_DATA } from '../../constants';

const Toolbar = ({ selectedTool, onChange }) => {
	return (
		<div style={{ position: 'fixed', display: 'flex' }}>
			{ELEMENT_TYPES_DATA.map(element => {
				return (
					<div key={element.type} title={`${element.label}`}>
						<button
							onClick={() => onChange(element.type)}
							className="toolBar"
							style={
								selectedTool === element.type
									? { backgroundColor: '#F5F4FF', color: '#4724D8', width: '20', height: '20' }
									: { backgroundColor: '#FDFDFD', width: '20', height: '20' }
							}
						>
							{element.icon}
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
