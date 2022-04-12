import './index.scss';
import { gateways, mapElements, trackElements } from 'constants/syookData';
import React from 'react';
import ListItem from './components/listItem';
import FacilityIcon from 'assets/facilityIcon';

interface LeftPanelProps {
	onElementSelect: () => void;
}

const LeftPanel = ({ onElementSelect }: LeftPanelProps) => {
	return (
		<>
			<div className="leftPanel canvasDrawingScrollBar">
				<span>Small Factory</span>
				<ul>
					{/* <ListItem icon={<FacilityIcon name="layer" />}>
						<span className="titleLabel">zone</span>
					</ListItem> */}
					<ListItem
						icon={<FacilityIcon name="image" />}
						label="Space Image"
						onElementSelect={onElementSelect}
					/>
					<ListItem
						icon={<FacilityIcon name="layer" />}
						items={mapElements}
						label="Map Elements"
						onElementSelect={onElementSelect}
					/>
					<ListItem
						icon={<FacilityIcon name="track" />}
						items={trackElements}
						label="Track Elements"
						onElementSelect={onElementSelect}
					/>
					<ListItem
						icon={<FacilityIcon name="gateway" />}
						items={gateways}
						label="Gateway"
						onElementSelect={onElementSelect}
					/>
				</ul>
			</div>
		</>
	);
};

LeftPanel.propTypes = {};

export default LeftPanel;
