import { ADD_POST, GET_POSTS, POST_LOADING } from '../actions/types'

const initialState = {
	posts: [],
	post: {},
	loading: false
}

export default function(state = initialState, action) {
	switch (action.type) {
		case POST_LOADING: {
			return {
				...state,
				loading: true
			}
		}
		case ADD_POST:
			return {
				...state,
				posts: [action.payload, ...state.posts]
			}
		case GET_POSTS:
			return {
				...state,
				posts: action.payload,
				loadiing: false
			}
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
