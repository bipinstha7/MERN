import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import jwt_decode from 'jwt-decode'

import { setCurrentUser, logoutUser } from './actions/authActions'
import setAuthToken from './utils/setAuthToken'
import store from './store'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import Footer from './components/layout/Footer'
import './App.css'

/** During browser refresh, redux store goes to its inital state
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
						</div>
						<Footer />
					</div>
				</BrowserRouter>
			</Provider>
		)
	}
}

export default App
