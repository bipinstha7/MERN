import axios from 'axios'
import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE, SET_CURRENT_USER } from './types'

/* Profile Loading */
export const setProfileLoading = () => {
	return {
		type: PROFILE_LOADING
	}
}

/* clear profile */
export const clearCurrentProfile = () => {
	return {
		type: CLEAR_CURRENT_PROFILE
	}
}

/* Get current profile */
export const getCurrentProfile = () => dispatch => {
	dispatch(setProfileLoading())
	axios
		.get('/api/profile')
		.then(profile => {
			dispatch({
				type: GET_PROFILE,
				payload: profile.data
			})
		})
		.catch(err =>
			dispatch({
				type: GET_PROFILE,
				payload: {}
			})
		)
}

/* Create Profile */
export const createProfile = (profileData, history) => dispatch => {
	axios
		.post('/api/profile', profileData)
		.then(result => history.push('/dashboard'))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data || err.message
			})
		)
}

/* Delete account and profile */
export const deleteAccount = () => dispatch => {
	if (window.confirm('Are you sure? This can NOT be undone !')) {
		axios
			.delete('/api/profile')
			.then(result =>
				dispatch({
					type: SET_CURRENT_USER,
					payload: {}
				})
			)
			.catch(err =>
				dispatch({
					type: GET_ERRORS,
					paylpoad: err.response.data
				})
			)
	}
}
