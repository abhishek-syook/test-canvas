import React from 'react';

const PolygonIcon = ({ ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			version="1.0"
			id="Layer_1"
			x="0px"
			y="0px"
			width="20px"
			height="20px"
			viewBox="0 0 64 64"
			enableBackground="new 0 0 64 64"
			xmlSpace="preserve"
		>
			<polygon
				fill="none"
				stroke="#000000"
				strokeWidth="2"
				strokeMiterlimit="10"
				points="16.675,59 1.351,32 16.675,5 47.325,5   62.649,32 47.325,59 "
			/>
		</svg>
	);
};

export default PolygonIcon;
