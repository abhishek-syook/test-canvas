import React from 'react';
import PropTypes from 'prop-types';

const GridToolbar = ({ isEnable, snapSize, onChange }) => {
	return (
		<div
			style={{
				left: 200,
				bottom: 0,
				padding: 10,
				display: 'flex',
				position: 'fixed'
			}}
		>
			<div>
				<input
					type="checkbox"
					id="gridDisplay"
					name="isEnable"
					checked={isEnable}
					onChange={() => onChange(p => ({ ...p, isEnable: !isEnable }))}
				/>
				<label htmlFor="gridDisplay">Show Grid</label>
			</div>
			<div style={{ marginLeft: 12 }}>
				<label htmlFor="snapSize">SnapSize</label>
				<input
					id="snapSize"
					style={{ width: 40, outline: 'none', marginLeft: 8 }}
					type="number"
					min={0}
					step={0.5}
					value={snapSize}
					onChange={e => onChange(p => ({ ...p, snapSize: +e.target.value }))}
				/>
			</div>
		</div>
	);
};

GridToolbar.propTypes = {
	isEnable: PropTypes.bool.isRequired,
	snapSize: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired
};

export default GridToolbar;
