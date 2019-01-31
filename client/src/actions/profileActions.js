import axios from 'axios'
import {
	GET_PROFILE,
	PROFILE_LOADING,
	GET_ERRORS,
	CLEAR_CURRENT_PROFILE,
	SET_CURRENT_USER,
	GET_PROFILES
} from './types'

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

/* Get profile by handle */
export const getProfileByHandle = handle => dispatch => {
	dispatch(setProfileLoading())
	axios
		.get(`/api/profile/handle/${handle}`)
		.then(profile => {
			dispatch({
				type: GET_PROFILE,
				payload: profile.data
			})
		})
		.catch(err =>
			dispatch({
				type: GET_PROFILE,
				payload: null
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

/* Add Experience */
export const addExperience = (expData, history) => dispatch => {
	axios
		.post('/api/profile/experience', expData)
		.then(result => history.push('/dashboard'))
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		})
}

/* Add Education */
export const addEducation = (eduData, history) => dispatch => {
	axios
		.post('/api/profile/education', eduData)
		.then(result => history.push('/dashboard'))
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		})
}

/* Delete Experience */
export const deleteExperience = id => dispatch => {
	if (window.confirm('Are you sure? This can NOT be undone !!')) {
		axios
			.delete(`/api/profile/experience/${id}`)
			.then(result =>
				dispatch({
					type: GET_PROFILE,
					payload: result.data
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

/* Delete Education */
export const deleteEducation = id => dispatch => {
	if (window.confirm('Are you sure? This can NOT be undone !!')) {
		axios
			.delete(`/api/profile/education/${id}`)
			.then(result =>
				dispatch({
					type: GET_PROFILE,
					payload: result.data
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

/* Get all profiles */
export const getProfiles = () => dispatch => {
	dispatch(setProfileLoading())
	axios
		.get(`/api/profile/all`)
		.then(result =>
			dispatch({
				type: GET_PROFILES,
				payload: result.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_PROFILES,
				paylpoad: null
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
