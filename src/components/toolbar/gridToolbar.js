import React from 'react';

const GridToolbar = ({ isEnable, snapSize, onChange }) => {
	return (
		<div
			style={{
				position: 'fixed',
				bottom: 0,
				padding: 10,
				left: 100,
				display: 'flex',
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

export default GridToolbar;
