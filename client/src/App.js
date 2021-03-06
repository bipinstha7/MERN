import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import jwt_decode from 'jwt-decode'

import { setCurrentUser, logoutUser } from './actions/authActions'
import { clearCurrentProfile } from './actions/profileActions'
import setAuthToken from './utils/setAuthToken'
import store from './store'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Footer from './components/layout/Footer'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './components/common/PrivateRoute'
import CreateProfile from './components/create-profile/CreateProfile'
import EditProfile from './components/edit-profile/EditProfile'
import AddExperience from './components/add-credentials/AddExperience'
import AddEducation from './components/add-credentials/AddEducation'
import './App.css'
import Profiles from './components/profiles/Profiles'
import Profile from './components/profile/Profile'
import NotFound from './components/not-found/NotFound'
import Posts from './components/posts/Posts'
import Post from './components/post/Post'

/** During browser refresh, redux store revert back to its inital state
 * And the authentication is false
 * To prevent this behaviour, check localstorage for token
 * And based on the token set the authentication when page loads
 */

/* check for token */
if (localStorage.getItem('jwtToken')) {
	/* set auth token header auth */
	setAuthToken(localStorage.getItem('jwtToken'))
	/* decode token and get user info & expiration */
	const decoded = jwt_decode(localStorage.getItem('jwtToken'))

	/* set user and isAuthencated */
	store.dispatch(setCurrentUser(decoded))

	/* check for expired token */
	const currentTime = Date.now() / 1000
	if (decoded.exp < currentTime) {
		/* log out user */
		store.dispatch(logoutUser())

		/* clear current profile */
		store.dispatch(clearCurrentProfile())

		/* redirect to login */
		window.location.href = '/login'
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div className="App">
						<Navbar />
						<Route exact path="/" component={Landing} />
						<div className="container">
							<Route exact path="/register" component={Register} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/profiles" component={Profiles} />
							<Route exact path="/profile/:handle" component={Profile} />
							<Switch>
								<PrivateRoute exact path="/dashboard" component={Dashboard} />
								<PrivateRoute exact path="/create-profile" component={CreateProfile} />
								<PrivateRoute exact path="/edit-profile" component={EditProfile} />
								<PrivateRoute exact path="/add-experience" component={AddExperience} />
								<PrivateRoute exact path="/add-education" component={AddEducation} />
								<PrivateRoute exact path="/feed" component={Posts} />
								<PrivateRoute exact path="/post/:id" component={Post} />
							</Switch>
							<Route exact path="/not-found" component={NotFound} />
						</div>
						<Footer />
					</div>
				</BrowserRouter>
			</Provider>
		)
	}
}

export default App
