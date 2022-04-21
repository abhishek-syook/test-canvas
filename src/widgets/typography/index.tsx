import './index.scss';

import React from 'react';

// Defining the HTML tag that the component will support
const variantsMapping = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	h6: 'h6',
	subheading1: 'h6',
	subheading2: 'h6',
	body1: 'p',
	body2: 'p'
};

interface TypographyProps {
	variant?: string;
	className?: any;
	children: React.ReactNode | string;
}

type ComponentType = any;

const Typography = ({ variant, className, children, ...props }: TypographyProps) => {
	// If the variant exists in variantsMapping, we use it.
	// Otherwise, use p tag instead.
	const Component: ComponentType = variantsMapping[variant as keyof typeof variantsMapping] ?? 'p';

	return (
		<Component className={`typography ${className}`} {...props}>
			{children}
		</Component>
	);
};

export default Typography;
