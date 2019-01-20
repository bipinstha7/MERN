import axios from 'axios'
import { ADD_POST, GET_ERRORS, GET_POSTS, POST_LOADING } from './types'

/* Add Post */
export const addPost = postData => dispatch => {
	axios
		.post(`/api/posts`, postData)
		.then(response =>
			dispatch({
				type: ADD_POST,
				payload: response.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		)
}

/* Get Post */
export const getPosts = () => dispatch => {
	dispatch(setPostLoading)
	axios
		.get(`/api/posts`)
		.then(result =>
			dispatch({
				type: GET_POSTS,
				payload: result.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_POSTS,
				payload: {}
			})
		)
}

/* set loading state */
export const setPostLoading = () => {
	return {
		type: POST_LOADING
	}
}
