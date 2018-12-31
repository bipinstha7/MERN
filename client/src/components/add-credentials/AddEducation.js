import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import TextFieldGroup from '../common/TextFieldGroup'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import { addEducation } from '../../actions/profileActions'

class AddEducation extends Component {
	state = {
		school: '',
		degree: '',
		fieldofstudy: '',
		from: '',
		to: '',
		current: false,
		description: '',
		errors: {},
		disabled: false
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.errors !== prevState.errors) {
			return { errors: nextProps.errors }
		}
		return null
	}

	onSubmit = event => {
		event.preventDefault()

		const { school, degree, fieldofstudy, from, to, current, description } = this.state

		const eduData = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description
		}

		this.props.addEducation(eduData, this.props.history)
	}

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value })
	}

	onCheck = () => {
		this.setState({
			disabled: !this.state.disabled,
			current: !this.state.current
		})
	}

	render() {
		const { errors } = this.state
		return (
			<div className="add-education">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">
								Go Back
							</Link>
							<h1 className="display-4 text-center">Add Education</h1>
							<p className="lead text-center">
								Add any school,bootcamp etc that you have attended
							</p>
							<small className="d-block pb-3">* = required fields</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* School"
									name="school"
									value={this.state.school}
									onChange={this.onChange}
									error={errors.school}
								/>
								<TextFieldGroup
									placeholder="* Degree of Certification"
									name="degree"
									value={this.state.degree}
									onChange={this.onChange}
									error={errors.degree}
								/>
								<TextFieldGroup
									placeholder="* Field of Study"
									name="fieldofstudy"
									value={this.state.fieldofstudy}
									onChange={this.onChange}
									error={errors.fieldofstudy}
								/>
								<h6>From Date</h6>
								<TextFieldGroup
									type="date"
									name="from"
									value={this.state.from}
									onChange={this.onChange}
									error={errors.from}
								/>
								<h6>To Date</h6>
								<TextFieldGroup
									type="date"
									name="to"
									value={this.state.to}
									onChange={this.onChange}
									error={errors.to}
									disabled={this.state.disabled ? 'disabled' : ''}
								/>
								<div className="form-check mb-4">
									<input
										type="checkbox"
										name="current"
										className="form-check-input"
										value={this.state.current}
										checked={this.state.current}
										onChange={this.onCheck}
										id="current"
									/>
									<label htmlFor="current" className="form-check-label">
										Current Job
									</label>
								</div>
								<TextAreaFieldGroup
									placeholder="Program Description"
									name="description"
									value={this.state.description}
									onChange={this.onChange}
									error={errors.description}
									info="Tell us about the program that you were in"
								/>
								<input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

AddEducation.propTypes = {
	addEducation: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors
})

export default connect(
	mapStateToProps,
	{ addEducation }
)(withRouter(AddEducation))