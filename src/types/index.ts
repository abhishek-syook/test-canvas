type ShapeElementPropertiesType = {
	fill: string;
	fillOpacity: number;
	stroke: string;
	strokeWidth: number;
	opacity?: never;
};

type ImageElementPropertiesType = {
	opacity: number;
	fill?: never;
	fillOpacity?: never;
	stroke?: never;
	strokeWidth?: never;
};

export type ElementPropertiesType = ShapeElementPropertiesType | ImageElementPropertiesType;

type CircleCoordinateType = {
	radius: number;
	cx: number;
	cy: number;
	x?: never;
	y?: never;
}[];

type OtherCoordinateType =
	| { x: number; y: number; radius?: never; cx?: never; cy?: never }[]
	| { x: string; y: string; radius?: never; cx?: never; cy?: never }[];

export type AllCoordinateType = CircleCoordinateType | OtherCoordinateType;

type MapTrackTypes = {
	_id: string;
	type: string;
	coordinates?: AllCoordinateType;
	elementType: string;
	label: string;
	labelCoordinates?: { x: null; y: null } | { x: number; y: number };
	zoneId: string;
	clusterId?: string;
	__v: number;
	createdAt: string;
	updatedAt: string;
	elementProperties?: ElementPropertiesType;
	imageProperties?: {
		uploadId: {
			_id: string;
			fileName: string;
			size: string;
			mimeType: string;
			fileId: string;
			createdAt: string;
			updatedAt: string;
			__v: number;
		};
		width: number;
		height: number;
	};
};

type GatewayType = {
	_id: string;
	name: string;
	hardwareType: string;
	identifierKey: string;
	identifierValue: string;
	coordinates: { x: number; y: number; z: number };
	plotCoordinates: { x: number; y: number; z: number };
	clusterId: {
		labels: string[];
		_id: string;
		name: string;
		description: string;
		zoneId: {
			labels: string[];
			_id: string;
			name: string;
			description: string;
		};
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
	type: string;
	__v: number;
	createdAt: string;
	updatedAt: string;
};

export type ElementType = MapTrackTypes | GatewayType;
