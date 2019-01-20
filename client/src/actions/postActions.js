import axios from 'axios'
import { ADD_POST, GET_ERRORS, GET_POSTS, POST_LOADING, DELETE_POST } from './types'

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

/* Delete Post */
export const deletePost = id => dispatch => {
	axios
		.delete(`/api/posts/${id}`)
		.then(result =>
			dispatch({
				type: DELETE_POST,
				payload: id
			})
		)
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		)
}

/* Add Like */
export const addLike = id => dispatch => {
	axios
		.post(`/api/posts/like/${id}`)
		.then(result => dispatch(getPosts()))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		)
}

/* Remove Like */
export const removeLike = id => dispatch => {
	axios
		.post(`/api/posts/unlike/${id}`)
		.then(result => dispatch(getPosts()))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		)
}

/* set loading state */
export const setPostLoading = () => {
	return {
		type: POST_LOADING
	}
}
