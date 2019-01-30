import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const TextFieldGroup = props => {
	const { type, name, placeholder, value, error, info, onChange, disabled } = props
	
	return (
		<div className="form-group">
			<input
				type={type}
				className={classNames('form-control', {
					'is-invalid': error
				})}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
			{info && <small className="form-text text-muted">{info}</small>}
			{error && <div className="invalid-feedback">{error}</div>}
		</div>
	)
}

TextFieldGroup.propTypes = {
	type: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	error: PropTypes.string,
	info: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.string
}

TextFieldGroup.defaultProps = {
	type: 'text'
}

export default TextFieldGroup
