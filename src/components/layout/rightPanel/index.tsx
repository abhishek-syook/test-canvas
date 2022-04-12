import './index.scss';

import React from 'react';
import MapAndTrackEdit from './components/mapAndTrackEdit';
import GatewayEdit from './components/gatewayEdit';

type allProps = {
	_id: string;
	type: string;
	coordinates:
		| { x: number; y: number }[]
		| {
				x: number;
				y: number;
				z: number;
		  };
	elementType?: string;
	label?: string;
	labelCoordinates?: {
		x: null;
		y: null;
	};
	zoneId?: string;
	clusterId?:
		| string
		| {
				labels: any;
				_id: string;
				name: string;
				description: string;
				zoneId: {
					labels: any;
					_id: string;
					name: string;
					description: string;
				};
		  };
	elementProperties?: {
		fill: string;
		fillOpacity: number;
		stroke: string;
		strokeWidth: number;
	};
	name?: string;
	hardwareType?: string;
	identifierKey?: string;
	identifierValue?: string;
	plotCoordinates?: {
		x: number;
		y: number;
		z: number;
	};
};

interface RightPanelProps {
	element: null | allProps;
}

const RightPanel = ({ element }: RightPanelProps) => {
	return (
		<div className="rightPanel">
			<span>Editor</span>
			{!element ? (
				<div className="notSelected">No Item Selected</div>
			) : Object.keys(element).includes('elementProperties') ? (
				<MapAndTrackEdit
					type={element.type}
					elementType={element.elementType}
					zone={(element.zoneId = element.zoneId!)}
					cluster={element.clusterId}
					label={(element.label = element.label!)}
					labelCoordinates={(element.labelCoordinates = element.labelCoordinates!)}
					coordinates={element.coordinates}
					elementProperties={(element.elementProperties = element.elementProperties!)}
				/>
			) : (
				<GatewayEdit
					name={(element.name = element.name!)}
					hardwareType={(element.hardwareType = element.hardwareType!)}
					identifierKey={(element.identifierKey = element.identifierKey!)}
					identifierValue={(element.identifierValue = element.identifierValue!)}
					coordinates={element.coordinates}
					plotCoordinates={(element.plotCoordinates = element.plotCoordinates!)}
					cluster={element.clusterId}
					type={(element.type = element.type!)}
				/>
			)}
		</div>
	);
};

export default RightPanel;
