import './index.scss';

import React from 'react';
import MapAndTrackEdit from './components/mapAndTrackEdit';
import GatewayEdit from './components/gatewayEdit';
import { ElementType } from 'types';

interface RightPanelProps {
	element: null | ElementType;
}

const RightPanel = ({ element }: RightPanelProps) => {
	return (
		<div className="rightPanel">
			<span>Editor</span>
			{!element || element.type === 'image' ? (
				<div className="notSelected">{element ? 'Cannot Edit Image' : 'No Item Selected'}</div>
			) : 'elementType' in element ? (
				<MapAndTrackEdit
					type={element.type}
					elementType={element.elementType}
					zone={element.zoneId}
					cluster={element.clusterId}
					label={element.label}
					labelCoordinates={element.labelCoordinates}
					coordinates={element.coordinates}
					elementProperties={element.elementProperties}
				/>
			) : (
				<GatewayEdit
					name={element.name}
					hardwareType={element.hardwareType}
					identifierKey={element.identifierKey}
					identifierValue={element.identifierValue}
					coordinates={element.coordinates}
					plotCoordinates={element.plotCoordinates}
					cluster={element.clusterId}
					type={element.type}
				/>
			)}
		</div>
	);
};

export default RightPanel;
