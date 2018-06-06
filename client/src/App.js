import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import {Provider} from "react-redux";
import jwt_decode from "jwt-decode";

import setAuthToken from "./utils/setAuthToken";
import {setCurrentUser} from "./actions/authActions";
import store from "./store";

import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

//check for token
if(localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // decode token and get user info and experience
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user in isAuthenticated
  store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
  render() {
    return (
      <Provider store={store} >
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
    );
  }
}

export default App;