import './index.scss';
import { gateways, mapElements, trackElements } from 'constants/syookData';
import React from 'react';
import ListItem from './components/listItem';

const LeftPanel = () => {
	return (
		<>
			<div className="leftPanel">
				<span>Small Factory</span>
				<ul>
					<ListItem>zone</ListItem>
					<ListItem>Space Image</ListItem>
					<ListItem items={mapElements}>Map Elements</ListItem>
					<ListItem items={trackElements}>Track Elements</ListItem>
					<ListItem items={gateways}>Gateway</ListItem>
				</ul>
			</div>
		</>
	);
};

LeftPanel.propTypes = {};

export default LeftPanel;
