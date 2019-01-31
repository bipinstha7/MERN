import React, { Component } from 'react'
import dayjs from 'dayjs'

class ProfileCreds extends Component {
	render() {
		const { education, experience } = this.props

		const expItems = experience.map(exp => (
			<li className="list-group-item" key={exp._id}>
				<h4>{exp.company}</h4>
				<p>
					{dayjs(exp.from).format('YYYY/MM/DD')} -{' '}
					{exp.to ? dayjs(exp.to).format('YYYY/MM/DD') : ' now'}{' '}
				</p>
				<p>
					<strong>Position</strong>
					{exp.title}
				</p>
				<p>
					{exp.location ? (
						<span>
							<strong>Location: {exp.location}</strong>
						</span>
					) : null}
				</p>
				<p>
					{exp.description ? (
						<span>
							<strong>Description: {exp.description}</strong>
						</span>
					) : null}
				</p>
			</li>
		))

		const eduItems = education.map(edu => (
			<li className="list-group-item" key={edu._id}>
				<h4>{edu.school}</h4>
				<p>
					{dayjs(edu.from).format('YYYY/MM/DD')} -{' '}
					{edu.to ? dayjs(edu.to).format('YYYY/MM/DD') : ' now'}{' '}
				</p>
				<p>
					<strong>Degree: </strong>
					{edu.degree}
				</p>
				<p>
					<strong>Field Of Study: </strong>
					{edu.fieldofstudy}
				</p>
				<p>
					{edu.description ? (
						<span>
							<strong>Description: {edu.description}</strong>
						</span>
					) : null}
				</p>
			</li>
		))

		return (
			<div className="row">
				<div className="col-md-6">
					<h3 className="text-center text-info">Experience</h3>
					{expItems.length ? (
						<ul className="list-group">{expItems}</ul>
					) : (
						<p className="text-center">No experience listed</p>
					)}
				</div>
				<div className="col-md-6">
					<h3 className="text-center text-info">Education</h3>
					{eduItems.length ? (
						<ul className="list-group">{eduItems}</ul>
					) : (
						<p className="text-center">No education listed</p>
					)}
				</div>
			</div>
		)
	}
}

export default ProfileCreds
