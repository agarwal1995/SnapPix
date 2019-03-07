import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbars from "./layout/Navbar";
import Footer from "./layout/Footer";
import Landing from "./layout/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";
import Firebase from "./firebase/Firebase";
import Profile from "./components/Profile";
import Feeds from "./components/Feeds";

class App extends Component {
  state = {
    authenticated: false,
    loader: true
  };

  componentDidMount() {
    Firebase.auth().onAuthStateChanged(authenticated => {
      authenticated
        ? this.setState(() => ({
            authenticated: true,
            loader: false
          }))
        : this.setState(() => ({
            authenticated: false,
            loader: false
          }));
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Navbars />
          <Route exact path="/" component={Landing} />
          <div className="container" />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/feeds" component={Feeds} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
