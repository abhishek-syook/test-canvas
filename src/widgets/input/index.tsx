import React from 'react';

const variantsMapping = {
	text: 'text',
	number: 'number'
};

interface InputProps {
	variant: string;
	value: string | number;
	onChange: (e: any) => void;
	disabled?: boolean;
	name: string;
	label?: string;
}

const Input = ({
	variant = 'text',
	value = '',
	onChange,
	disabled = false,
	name,
	label
}: InputProps) => {
	const type = variantsMapping[variant as keyof typeof variantsMapping] ?? 'text';

	const onInputChange = (e: any) => {
		!disabled && onChange(e);
	};

	return (
		<label>
			{label && <label>{label}</label>}
			<input type={type} value={value} onChange={onInputChange} disabled={disabled} name={name} />
		</label>
	);
};

export default Input;
