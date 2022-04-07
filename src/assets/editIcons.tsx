import React from 'react';

const icons = {
	undo: (
		<path
			fill="currentColor"
			d="M8,9.8V10.7L9.7,11C12.3,11.4 14.2,12.4 15.6,13.7C13.9,13.2 12.1,12.9 10,12.9H8V14.2L5.8,12L8,9.8M10,5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9"
		/>
	),
	redo: (
		<path
			fill="currentColor"
			d="M14,5V9C7,10 4,15 3,20C5.5,16.5 9,14.9 14,14.9V19L21,12L14,5M16,9.83L18.17,12L16,14.17V12.9H14C11.93,12.9 10.07,13.28 8.34,13.85C9.74,12.46 11.54,11.37 14.28,11L16,10.73V9.83Z"
		/>
	)
};

interface EditIconsProps {
	name: string;
	width?: number;
	height?: number;
}

const EditIcons = ({ name, width = 24, height = 24 }: EditIconsProps) => {
	const icon = icons[name as keyof typeof icons];

	return (
		<svg aria-hidden="true" viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
			{icon}
		</svg>
	);
};
export default EditIcons;
