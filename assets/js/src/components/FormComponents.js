import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Form Group Component - Reusable form field wrapper.
 *
 * @param {Object} props Component props
 * @param {string} props.label Field label
 * @param {string} props.description Optional description
 * @param {React.ReactNode} props.children Form field element
 */
export const FormGroup = ( { label, description, children } ) => {
	return (
		<div className="form-group">
			<label className="form-label">{ label }</label>
			{ children }
			{ description && <p className="description">{ description }</p> }
		</div>
	);
};

/**
 * Text Input Component.
 */
export const TextInput = ( {
	name,
	value,
	onChange,
	placeholder = '',
	type = 'text',
} ) => {
	return (
		<input
			type={ type }
			name={ name }
			value={ value || '' }
			onChange={ onChange }
			placeholder={ placeholder }
			className="regular-text"
		/>
	);
};

/**
 * Textarea Component.
 */
export const TextArea = ( {
	name,
	value,
	onChange,
	placeholder = '',
	rows = 4,
} ) => {
	return (
		<textarea
			name={ name }
			value={ value || '' }
			onChange={ onChange }
			placeholder={ placeholder }
			rows={ rows }
			className="large-text"
		/>
	);
};

/**
 * Select Component.
 */
export const Select = ( {
	name,
	value,
	onChange,
	options,
	placeholder = '',
} ) => {
	return (
		<select
			name={ name }
			value={ value || '' }
			onChange={ onChange }
			className="regular-text"
		>
			{ placeholder && <option value="">{ placeholder }</option> }
			{ options.map( ( option ) => (
				<option key={ option.value } value={ option.value }>
					{ option.label }
				</option>
			) ) }
		</select>
	);
};

/**
 * Checkbox Component.
 */
export const Checkbox = ( { name, checked, onChange, label } ) => {
	return (
		<label className="checkbox-label">
			<input
				type="checkbox"
				name={ name }
				checked={ checked || false }
				onChange={ onChange }
			/>
			<span>{ label }</span>
		</label>
	);
};

/**
 * Section Component - Groups related fields.
 */
export const Section = ( { title, description, children } ) => {
	return (
		<div className="settings-section">
			<h3 className="section-title">{ title }</h3>
			{ description && (
				<p className="section-description">{ description }</p>
			) }
			<div className="section-content">{ children }</div>
		</div>
	);
};

/**
 * Card Component - Container for settings sections.
 */
export const Card = ( { title, children } ) => {
	return (
		<div className="settings-card">
			{ title && <h2 className="card-title">{ title }</h2> }
			<div className="card-content">{ children }</div>
		</div>
	);
};
