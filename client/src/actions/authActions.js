import { GET_ERRORS, SET_CURRENT_USER } from './types'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import setAuthToken from '../utils/setAuthToken'

/* Register User */
export const registerUser = (userData, history) => dispatch => {
	axios
		.post('/api/users/register', userData)
		.then(result => history.push('/login'))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data || err.message
			})
		)
}

/* Set logged in user */
export const setCurrentUser = decoded => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	}
}

/* Login - Get User Token */
export const loginUser = userData => dispatch => {
	axios
		.post('/api/users/login', userData)
		.then(result => {
			/* save to localStorage */
			const { token } = result.data
			localStorage.setItem('jwtToken', token)

			/* set token to auth header */
			setAuthToken(token)

			/* decode token to get user data */
			const decoded = jwt_decode(token)

			/* set current user */
			dispatch(setCurrentUser(decoded))
		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data || err.message
			})
		)
}
