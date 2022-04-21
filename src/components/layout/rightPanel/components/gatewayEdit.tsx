import React from 'react';

interface GatewayEditProps {
	name: string;
	hardwareType: string;
	identifierKey: string;
	identifierValue: string;
	coordinates: any;
	plotCoordinates: {
		x: number;
		y: number;
		z: number;
	};
	cluster: any;
	type: string;
}

const GatewayEdit = ({
	name,
	hardwareType,
	identifierKey,
	identifierValue,
	coordinates,
	plotCoordinates,
	cluster,
	type
}: GatewayEditProps) => {
	return (
		<div>
			<div>
				<h3>Gateway</h3>
				<p>Name: {name}</p>
				<p>Type: {type}</p>
				<p>Hardware Type: {hardwareType}</p>
				<p>Identifier Key: {identifierKey}</p>
				<p>Identifier Value: {identifierValue}</p>
				<p>Physical Co-ordinates</p>
				<span>
					x: {coordinates.x ?? 'NA'} y: {coordinates.y ?? 'NA'} z: {coordinates.z ?? 'NA'}
				</span>
				<p>Plot Co-ordinates</p>
				<span>
					x: {plotCoordinates.x ?? 'NA'} y: {plotCoordinates.y ?? 'NA'} z: {plotCoordinates.z ?? 'NA'}
				</span>
			</div>
			{type === 'track' && (
				<div>
					<h3>Cluster</h3>
					<p>Cluster Name: {cluster?.name}</p>
				</div>
			)}

			<div>
				<h3>Zone</h3>
				<p>Zone: {cluster?.zoneId?.name}</p>
			</div>
		</div>
	);
};

export default GatewayEdit;
