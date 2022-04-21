import React from 'react';
import { ELEMENT_TYPES } from 'constants/index';
import { AllCoordinateType, ElementPropertiesType } from 'types';

interface clusterProps {
	labels: [];
	_id: string;
	name: string;
	description: string;
	zoneId: { labels: []; _id: string; name: string; description: string };
}

interface MapAndTrackEditProps {
	type: string;
	elementType: string;
	zone: string;
	cluster?: string | clusterProps | undefined;
	label: string;
	labelCoordinates?: { x: null; y: null } | { x: number; y: number };
	coordinates?: AllCoordinateType;
	elementProperties?: ElementPropertiesType;
}

const MapAndTrackEdit = ({
	type,
	elementType,
	zone,
	// cluster,
	label,
	labelCoordinates,
	coordinates,
	elementProperties
}: MapAndTrackEditProps) => {
	return (
		<div>
			<div>
				<h3>General</h3>
				<p>Type: {type}</p>
				<p>Shape: {elementType}</p>
				{/* TODO: update after build check */}
				{/* {type === 'track' ? <span>Cluster: {cluster}</span> : null} */}
				<p>Zone: {zone}</p>
			</div>
			<div>
				<h3>Label</h3>
				<p>Name: {label}</p>
				<p>Co-ordinates</p>
				<span>
					x: {labelCoordinates?.x ?? 'NA'} y: {labelCoordinates?.y ?? 'NA'}
				</span>
			</div>
			<div>
				<h3>Element Properties</h3>
				<p>Co-ordinates</p>
				{coordinates &&
					(elementType === 'circle' ? (
						<span>
							Radius: {coordinates[0].radius} cx: {coordinates[0].cx} cy: {coordinates[0].cy}
						</span>
					) : (
						coordinates?.map((coordinate, i) => {
							return (
								<span key={i}>
									x: {coordinate.x} y: {coordinate.y}
								</span>
							);
						})
					))}
				{[ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.RECTANGLE, ELEMENT_TYPES.CIRCLE].includes(
					elementType
				) && (
					<div>
						<p>Fill: {elementProperties?.fill}</p>
						<p>Fill opacity: {elementProperties?.fillOpacity}</p>
						<p>Stroke: {elementProperties?.stroke}</p>
						<p>Stroke width: {elementProperties?.strokeWidth}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default MapAndTrackEdit;
