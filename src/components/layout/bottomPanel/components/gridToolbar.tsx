import React from 'react';

interface GridToolbarProps {
	gridObj: {
		isEnable: boolean;
		snapSize: number;
	};
	onChange: (newGridObj: { isEnable: boolean; snapSize: number }) => void;
}

const GridToolbar = ({ gridObj, onChange }: GridToolbarProps) => {
	const { isEnable, snapSize } = gridObj;

	return (
		<div
			style={{
				display: 'flex'
			}}
		>
			<div>
				<input
					type="checkbox"
					id="gridDisplay"
					name="isEnable"
					checked={isEnable}
					onChange={() => onChange({ isEnable: !isEnable, snapSize })}
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
					onChange={e => onChange({ isEnable, snapSize: +e.target.value })}
				/>
			</div>
		</div>
	);
};

export default GridToolbar;
