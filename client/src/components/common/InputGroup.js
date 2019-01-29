import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const InputGroup = props => {
	const { name, placeholder, value, error, icon, onChange } = props

	return (
		<div className="input-group mb-3">
			<div className="input-group-prepend">
				<span className="input-group-text">
					<i className={icon} />
				</span>
			</div>
			<input
				className={classNames('form-control', {
					'is-invalid': error
				})}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
			/>
			{error && <div className="invalid-feedback">{error}</div>}
		</div>
	)
}

InputGroup.propTypes = {
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	error: PropTypes.string,
	icon: PropTypes.string,
	onChange: PropTypes.func.isRequired
}

InputGroup.defaultProps = {
	type: 'text'
}

export default InputGroup
