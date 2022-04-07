import './index.scss';

import React from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';

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

const Typography = ({ variant, className, children, ...props }) => {
	// If the variant exists in variantsMapping, we use it.
	// Otherwise, use p tag instead.
	const Component = variantsMapping?.[variant] ?? 'p';

	return (
		<Component
			className={`typography ${className}`}
			// className={cx(
			// 'typography',
			// {
			// [`typography--variant-${variant}`]: variant
			// },
			// className
			// )}
			{...props}
		>
			{children}
		</Component>
	);
};

Typography.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.any,
	children: PropTypes.node.isRequired
};

export default Typography;
