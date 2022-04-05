import React from 'react';

const RectangleIcon = ({ ...props }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 512 512">
			<path
				fill="var(--ci-primary-color, currentColor)"
				d="M36,416H476a20.023,20.023,0,0,0,20-20V116a20.023,20.023,0,0,0-20-20H36a20.023,20.023,0,0,0-20,20V396A20.023,20.023,0,0,0,36,416ZM48,128H464V384H48Z"
				className="ci-primary"
			/>
		</svg>
	);
};

export default RectangleIcon;
