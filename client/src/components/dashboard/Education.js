import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

import { deleteEducation } from '../../actions/profileActions'

class Education extends Component {
	onDeleteClick = id => {
		this.props.deleteEducation(id)
	}

	render() {
		const education = this.props.education.map(edu => {
			return (
				<tr key={edu._id}>
					<td>{edu.school}</td>
					<td>{edu.degree}</td>
					<td>
						{dayjs(edu.from).format('YYYY/MM/DD')} -{' '}
						{edu.to ? dayjs(edu.to).format('YYYY/MM/DD') : 'now'}
					</td>
					<td>
						<button className="btn btn-danger" onClick={() => this.onDeleteClick(edu._id)}>Delete</button>
					</td>
				</tr>
			)
		})

		return (
			<div>
				<h4 className="mb-4">Education Credentials</h4>
				<table className="table">
					<thead>
						<tr>
							<th>School</th>
							<th>Degree</th>
							<th>Years</th>
							<th />
						</tr>
					</thead>
					<tbody>{education}</tbody>
				</table>
			</div>
		)
	}
}

Education.propTypes = {
	deleteEducation: PropTypes.func.isRequired
}

export default connect(
	null,
	{ deleteEducation }
)(Education)
