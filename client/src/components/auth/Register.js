import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { registerUser } from '../../actions/authActions'
import TextFieldGroup from '../common/TextFieldGroup'

class Register extends Component {
	state = {
		name: '',
		email: '',
		password: '',
		password2: '',
		errors: {}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.errors !== prevState.errors) {
			return { errors: nextProps.errors }
		}
		return null
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard')
		}
	}

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value })
	}

	onSubmit = event => {
		event.preventDefault()

		const { name, email, password, password2 } = this.state

		const newUser = {
			name,
			email,
			password,
			password2
		}

		this.props.registerUser(newUser, this.props.history)
	}

	render() {
		const { errors } = this.state

		return (
			<div className="register">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Sign Up</h1>
							<p className="lead text-center">Create your DevConnector account</p>
							<form noValidate onSubmit={this.onSubmit}>
								<TextFieldGroup
									name="name"
									placeholder="Name"
									value={this.state.name}
									onChange={this.onChange}
									error={errors.name}
								/>

								<TextFieldGroup
									type="email"
									name="email"
									placeholder="Email Address"
									value={this.state.email}
									onChange={this.onChange}
									error={errors.email}
									info="This site uses Gravatar so if you want a profile image, use a Gravatar
									email"
								/>

								<TextFieldGroup
									type="password"
									name="password"
									placeholder="Password"
									value={this.state.password}
									onChange={this.onChange}
									error={errors.password}
								/>

								<TextFieldGroup
									type="password"
									name="password2"
									placeholder="Confirm Password"
									value={this.state.password2}
									onChange={this.onChange}
									error={errors.password2}
								/>

								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
})

export default connect(
	mapStateToProps,
	{ registerUser }
)(withRouter(Register))
