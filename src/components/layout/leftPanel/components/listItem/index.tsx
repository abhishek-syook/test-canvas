import './index.scss';
import React, { FC, useState } from 'react';

import trackSvg from 'assets/track.svg';

interface Props {
	items?: { _id: string }[] | null;
	icon: React.ReactNode | null;
	label?: string;
}

const ListItem: FC<Props> = ({ items, icon, label }) => {
	const [isExpand, setIsExpand] = useState(true);

	return (
		<li className="listItem">
			<div className="__itemRow" onClick={() => setIsExpand(p => !p)}>
				{icon}
				{label && <span className="titleLabel">{`${label} (${items?.length ?? '0'})`}</span>}
			</div>
			{items && isExpand && (
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
