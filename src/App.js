import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbars from "./layout/Navbar";
import Footer from "./layout/Footer";
import Landing from "./layout/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";
import Firebase from "./firebase/Firebase";

class App extends Component {
  state = {
    authenticated: false
  };

  componentDidMount() {
    Firebase.auth().onAuthStateChanged(authenticated => {
      authenticated
        ? this.setState(() => ({
            authenticated: true
          }))
        : this.setState(() => ({
            authenticated: false
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
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
