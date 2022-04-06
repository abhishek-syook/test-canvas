import './index.scss';
import React, { FC } from 'react';

import trackSvg from 'assets/track.svg';

interface Props {
	children: React.ReactNode | string;
	items?: { _id: string }[] | null;
	icon: React.ReactNode | null;
}

const ListItem: FC<Props> = ({ children, items, icon }) => {
	return (
		<li className="listItem">
			<div className="__itemRow">
				{icon}
				{children}
			</div>
			{items && (
				<ul>
					{items.map(item => {
						return (
							<li key={item._id} className="__itemRow">
								<img src={trackSvg} width={24} height={24} />
								{item._id}
							</li>
						);
					})}
				</ul>
			)}
		</li>
	);
};

export default ListItem;
