import React from 'react';

const LineIcon = ({ ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20px"
			height="20px"
			viewBox="0 0 15 15"
			fill="none"
		>
			<path
				d="M1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3C1.73157 3 1.95089 2.94752 2.14671 2.85381L12.1462 12.8533C12.0525 13.0491 12 13.2684 12 13.5C12 14.3284 12.6716 15 13.5 15C14.3284 15 15 14.3284 15 13.5C15 12.6716 14.3284 12 13.5 12C13.2684 12 13.0491 12.0525 12.8533 12.1462L2.85381 2.14671C2.94752 1.95089 3 1.73157 3 1.5C3 0.671573 2.32843 0 1.5 0Z"
				fill="black"
			/>
		</svg>
	);
};

export default LineIcon;