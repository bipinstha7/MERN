import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

import TextFieldGroup from '../common/TextFieldGroup'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import InputGroup from '../common/InputGroup'
import SelectListGroup from '../common/SelectListGroup'
import { createProfile, getCurrentProfile } from '../../actions/profileActions'
import isEmpty from '../../validation/is-empty'

class EditProfile extends Component {
	state = {
		displaySocialInputs: false,
		handle: '',
		company: '',
		website: '',
		location: '',
		status: '',
		skills: '',
		githubusername: '',
		bio: '',
		twitter: '',
		facebook: '',
		linkedin: '',
		youtube: '',
		instagram: '',
		errors: {}
	}

	componentDidMount() {
		this.props.getCurrentProfile()
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.errors !== prevState.errors) {
			return { errors: nextProps.errors }
		}
		console.log('nextprops', nextProps.profile)

		const checkPrevStateAndLoading = prevState.handle === '' && !nextProps.profile.loading
		const isMatch =
			nextProps.profile.profile &&
			JSON.stringify(nextProps.profile.profile.experience) === JSON.stringify(prevState.experience)
		if (checkPrevStateAndLoading || isMatch) {
			const profile = nextProps.profile.profile

			/* bring skills array back to csv */
			const skillsCSV = profile.skills.join(',')

			/* if profile field doesn't exist, make empty string */
			profile.company = !isEmpty(profile.company) ? profile.company : ''
			profile.website = !isEmpty(profile.website) ? profile.website : ''
			profile.location = !isEmpty(profile.location) ? profile.location : ''
			profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername : ''
			profile.bio = !isEmpty(profile.bio) ? profile.bio : ''

			profile.social = !isEmpty(profile.social) ? profile.social : {}
			profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : ''
			profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : ''
			profile.linkedin = !isEmpty(profile.social.Linkedin) ? profile.social.Linkedin : ''
			profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : ''
			profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : ''

			const {
				handle,
				company,
				website,
				location,
				status,
				githubusername,
				bio,
				twitter,
				facebook,
				linkedin,
				youtube,
				instagram
			} = profile

			/* set component fields state */
			return {
				handle,
				company,
				website,
				location,
				status,
				skills: skillsCSV,
				githubusername,
				bio,
				twitter,
				facebook,
				linkedin,
				youtube,
				instagram
			}
		}
		return null
	}

	onSubmit = event => {
		event.preventDefault()

		const {
			handle,
			company,
			website,
			location,
			status,
			skills,
			githubusername,
			bio,
			twitter,
			facebook,
			linkedin,
			youtube,
			instagram
		} = this.state

		const profileData = {
			handle,
			company,
			website,
			location,
			status,
			skills,
			githubusername,
			bio,
			twitter,
			facebook,
			linkedin,
			youtube,
			instagram
		}

		this.props.createProfile(profileData, this.props.history)
	}

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value })
	}

	toggleIcon = () => {
		this.setState(prevState => ({ displaySocialInputs: !prevState.displaySocialInputs }))
	}

	render() {
		const { errors, displaySocialInputs } = this.state

		/* select options for status */
		const options = [
			{ label: '* Select Professonal Status', value: 0 },
			{ label: 'Developer', value: 'Developer' },
			{ label: 'Junior Developer', value: 'Junior Developer' },
			{ label: 'Senior Developer', value: 'Senior Developer' },
			{ label: 'Manager', value: 'Manager' },
			{ label: 'Student or Learning', value: 'Student or Learning' },
			{ label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
			{ label: 'Intern', value: 'Intern' },
			{ label: 'Other', value: 'Other' }
		]

		let socialInputs

		if (displaySocialInputs) {
			socialInputs = (
				<div>
					<InputGroup
						placeholder="Twitter Profile URL"
						name="twitter"
						icon="fab fa-twitter"
						value={this.state.twitter}
						onChange={this.onChange}
						error={errors.twitter}
					/>
					<InputGroup
						placeholder="Facebook Page URL"
						name="facebook"
						icon="fab fa-facebook"
						value={this.state.facebook}
						onChange={this.onChange}
						error={errors.facebook}
					/>
					<InputGroup
						placeholder="Linkedin Profile URL"
						name="linkedin"
						icon="fab fa-linkedin"
						value={this.state.linkedin}
						onChange={this.onChange}
						error={errors.linkedin}
					/>
					<InputGroup
						placeholder="Youtube Channel URL"
						name="youtube"
						icon="fab fa-youtube"
						value={this.state.youtube}
						onChange={this.onChange}
						error={errors.youtube}
					/>
					<InputGroup
						placeholder="Instagram Page URL"
						name="instagram"
						icon="fab fa-instagram"
						value={this.state.instagram}
						onChange={this.onChange}
						error={errors.instagram}
					/>
				</div>
			)
		}

		return (
			<div className="create-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">
								Go Back
							</Link>
							<h1 className="display-4 text-center">Edit Your Profile</h1>
							<p className="lead text-center">
								Let's get some information to make your profile stand out
							</p>
							<small className="d-block pb-3">* = required fields</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Profile Handle"
									name="handle"
									value={this.state.handle}
									onChange={this.onChange}
									error={errors.handle}
									info="A unique handle for your profile URL. Your full name, company name, nickname etc"
								/>
								<SelectListGroup
									placeholder="* Status"
									name="status"
									value={this.state.status}
									onChange={this.onChange}
									options={options}
									error={errors.status}
									info="Give us an idea of where you are at in your career"
								/>
								<TextFieldGroup
									placeholder="Company"
									name="company"
									value={this.state.company}
									onChange={this.onChange}
									error={errors.company}
									info="Could be your own company or one you work for"
								/>
								<TextFieldGroup
									placeholder="Website"
									name="website"
									value={this.state.website}
									onChange={this.onChange}
									error={errors.website}
									info="Could be your own website or a company one"
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={this.state.location}
									onChange={this.onChange}
									error={errors.location}
									info="City or city & state suggested (eg. Kathmandu, Pokhara)"
								/>
								<TextFieldGroup
									placeholder="Skills"
									name="skills"
									value={this.state.skills}
									onChange={this.onChange}
									error={errors.skills}
									info="Please use comma separated values (eg. JavaScript, Nodejs, HTML, CSS)"
								/>
								<TextFieldGroup
									placeholder="Github Username"
									name="githubusername"
									value={this.state.githubusername}
									onChange={this.onChange}
									error={errors.githubusername}
									info="If you want your latest repos and a Githu link, include your username"
								/>
								<TextAreaFieldGroup
									placeholder="Short Bio"
									name="bio"
									value={this.state.bio}
									onChange={this.onChange}
									error={errors.bio}
									info="Tell us a little about yourself"
								/>
								<div className="mb-3">
									<button
										type="button"
										onClick={() => this.toggleIcon()}
										className="btn btn-light"
									>
										Add Social Network Links
									</button>
									<span className="text-muted">Optional</span>
								</div>
								{socialInputs}
								<input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

EditProfile.proptypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	createProfile: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors
})

export default connect(
	mapStateToProps,
	{ createProfile, getCurrentProfile }
)(withRouter(EditProfile))
