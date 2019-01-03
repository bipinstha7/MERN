import React from 'react'
import classNames from 'classnames'
import PorpTypes from 'prop-types'

const TextFieldGroup = props => {
	const { type, name, placeholder, value, error, info, onChange, disabled } = props

	return (
		<div className="form-group">
			<input
				type={type}
				className={classNames('form-control form-control-lg', {
					'is-invalid': error
				})}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
				disbaled={disabled}
			/>
			{info && <small className="form-text text-muted" />}
			{error && <div className="invalid-feedback">{error}</div>}
		</div>
	)
}

TextFieldGroup.propTypes = {
	type: PorpTypes.string.isRequired,
	name: PorpTypes.string.isRequired,
	placeholder: PorpTypes.string,
	value: PorpTypes.string.isRequired,
	error: PorpTypes.string,
	info: PorpTypes.string,
	onChange: PorpTypes.func.isRequired,
	disabled: PorpTypes.string
}

TextFieldGroup.defaultProps = {
	type: 'text'
}

export default TextFieldGroup
