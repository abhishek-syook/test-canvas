import React from 'react';

const icons = {
	undo: (
		<path
			fill="currentColor"
			d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"
		/>
	),
	redo: (
		<path
			fill="currentColor"
			d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"
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
