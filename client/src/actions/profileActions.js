import axios from 'axios'
import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE } from './types'

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
		.then(profile =>
			dispatch({
				type: GET_PROFILE,
				paylpoad: profile.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_PROFILE,
				payload: {}
			})
		)
}
