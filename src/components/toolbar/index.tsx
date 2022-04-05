import React, { FC } from 'react';
import { ELEMENT_TYPES } from '../../constants';

interface Props {
	selectedTool: string;
	onChange: (elementType: string) => string;
}

const Toolbar: FC<Props> = ({ selectedTool, onChange }) => {
	return (
		<div>
			<input
				type="radio"
				id="selection"
				checked={selectedTool === ELEMENT_TYPES.SELECTION}
				onChange={() => onChange(ELEMENT_TYPES.SELECTION)}
			/>
			<label htmlFor="selection">Selection</label>

			<input
				type="radio"
				id="line"
				checked={selectedTool === ELEMENT_TYPES.LINE}
				onChange={() => onChange(ELEMENT_TYPES.LINE)}
			/>
			<label htmlFor="line">Line</label>

			<input
				type="radio"
				id="rectangle"
				checked={selectedTool === ELEMENT_TYPES.RECTANGLE}
				onChange={() => onChange(ELEMENT_TYPES.RECTANGLE)}
			/>
			<label htmlFor="rectangle">Rectangle</label>

			<input
				type="radio"
				id="pencil"
				checked={selectedTool === ELEMENT_TYPES.PENCIL}
				onChange={() => onChange(ELEMENT_TYPES.PENCIL)}
			/>
			<label htmlFor="pencil">Pencil</label>

			<input
				type="radio"
				id="text"
				checked={selectedTool === ELEMENT_TYPES.TEXT}
				onChange={() => onChange(ELEMENT_TYPES.TEXT)}
			/>
			<label htmlFor="text">Text</label>

			<input
				type="radio"
				id="polygon"
				checked={selectedTool === ELEMENT_TYPES.POLYGON}
				onChange={() => onChange(ELEMENT_TYPES.POLYGON)}
			/>
			<label htmlFor="polygon">Polygon</label>

			<input
				type="radio"
				id="polyline"
				checked={selectedTool === ELEMENT_TYPES.POLYLINE}
				onChange={() => onChange(ELEMENT_TYPES.POLYLINE)}
			/>
			<label htmlFor="polyline">Polyline</label>

			<input
				type="radio"
				id="circle"
				checked={selectedTool === ELEMENT_TYPES.CIRCLE}
				onChange={() => onChange(ELEMENT_TYPES.CIRCLE)}
			/>
			<label htmlFor="circle">Circle</label>

			<input
				type="radio"
				id="gateway"
				checked={selectedTool === ELEMENT_TYPES.GATEWAY}
				onChange={() => onChange(ELEMENT_TYPES.GATEWAY)}
			/>
			<label htmlFor="gateway">Gateway</label>
		</div>
	);
};

export default Toolbar;
