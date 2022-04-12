import './index.scss';
import React, { FC, useState } from 'react';

import ToolIcons from 'assets/toolIcons';

interface Props {
	items?: { _id: string; elementType?: string }[] | null;
	icon: React.ReactNode | null;
	label?: string;
	onElementSelect: (element: object) => void;
}

const ListItem: FC<Props> = ({ items, icon, label, onElementSelect }) => {
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
							<li key={item._id} className="__itemRow" onClick={() => onElementSelect(item)}>
								<ToolIcons name={item.elementType ? item.elementType : 'gateway'} />
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
