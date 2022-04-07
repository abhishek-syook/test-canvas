import './index.scss';
import { gateways, mapElements, trackElements } from 'constants/syookData';
import React from 'react';
import ListItem from './components/listItem';
import FacilityIcon from 'assets/facilityIcon';

const LeftPanel = () => {
	return (
		<>
			<div className="leftPanel canvasDrawingScrollBar">
				<span>Small Factory</span>
				<ul>
					{/* <ListItem icon={<FacilityIcon name="layer" />}>
						<span className="titleLabel">zone</span>
					</ListItem> */}
					<ListItem icon={<FacilityIcon name="image" />} label="Space Image" />
					<ListItem icon={<FacilityIcon name="layer" />} items={mapElements} label="Map Elements" />
					<ListItem icon={<FacilityIcon name="track" />} items={trackElements} label="Track Elements" />
					<ListItem icon={<FacilityIcon name="gateway" />} items={gateways} label="Gateway" />
				</ul>
			</div>
		</>
	);
};

LeftPanel.propTypes = {};

export default LeftPanel;
