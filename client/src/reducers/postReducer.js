import { GET_POST, GET_POSTS, POST_LOADING, ADD_POST, DELETE_POST } from '../actions/types'

const initialState = {
	posts: [],
	post: {},
	loading: false
}

export default function(state = initialState, action) {
	switch (action.type) {
		// case PROFILE_LOADING:
		// 	return {
		// 		...state,
		// 		loading: true
		// 	}
		// case GET_PROFILE:
		// 	return {
		// 		...state,
		// 		profile: action.payload,
		// 		loading: false
		// 	}
		// case CLEAR_CURRENT_PROFILE:
		// 	return {
		// 		...state,
		// 		profile: null
		// 	}
		// case GET_PROFILES:
		// 	return {
		// 		...state,
		// 		profiles: action.payload,
		// 		loading: false
		// 	}
		default:
			return state
	}
}