import './index.scss';
import { gateways, mapElements, trackElements } from 'constants/syookData';
import React from 'react';
import ListItem from './components/listItem';
import FacilityIcon from 'assets/facilityIcon';

const LeftPanel = () => {
	return (
		<>
			<div className="leftPanel">
				<span>Small Factory</span>
				<ul>
					<ListItem icon={<FacilityIcon name="layer" />}>
						<span className="titleLabel">zone</span>
					</ListItem>
					<ListItem icon={<FacilityIcon name="image" />}>
						<span className="titleLabel">Space Image</span>
					</ListItem>
					<ListItem icon={<FacilityIcon name="layer" />} items={mapElements}>
						<span className="titleLabel">Map Elements</span>
					</ListItem>
					<ListItem icon={<FacilityIcon name="track" />} items={trackElements}>
						<span className="titleLabel">Track Elements</span>
					</ListItem>
					<ListItem icon={<FacilityIcon name="gateway" />} items={gateways}>
						<span className="titleLabel">Gateway</span>
					</ListItem>
				</ul>
			</div>
		</>
	);
};

LeftPanel.propTypes = {};

export default LeftPanel;
