import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./../style.css";
import signInImage from "./../img/signin-image.jpg";
import Firebase from "./../firebase/Firebase";

class Login extends Component {
  state = {
    email: "",
    password: "",
    error: null
  };

  handelSubmit = event => {
    event.preventDefault();
    const { email, password, error } = this.state;
    console.log(email);

    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.props.history.push("/feeds");
      })
      .catch(error => {
        this.props.history.push("/");
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    Firebase.auth().onAuthStateChanged(authenticated => {
      authenticated
        ? this.props.history.push("/feeds")
        : this.setState(() => ({
            authenticated: false
          }));
    });
  }

  render() {
    const { email, password } = this.state;
    return (
      <section className="sign-in">
        <div className="container">
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                <img src={signInImage} alt="" />
              </figure>
              <a href="/register" className="signup-image-link">
                Create an account
              </a>
            </div>

            <div className="signin-form">
              <h2 className="form-title">Sign In</h2>
              <form
                method="POST"
                className="login-form"
                onSubmit={this.handelSubmit}
                id="login-form"
              >
                <div className="form-group">
                  <label htmlFor="your_name">
                    <i className="zmdi zmdi-account material-icons-name" />
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    id="email"
                    onChange={this.handleChange}
                    placeholder="Your Email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="your_pass">
                    <i className="zmdi zmdi-lock" />
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    id="password"
                    onChange={this.handleChange}
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                    className="agree-term"
                  />
                  <label htmlFor="remember-me" className="label-agree-term">
                    <span>
                      <span />
                    </span>
                    Remember me
                  </label>
                </div>
                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signin"
                    id="signin"
                    className="form-submit"
                    value="Log in"
                  />
                </div>
              </form>
              <div className="social-login">
                <span className="social-label">Or login with</span>
                <ul className="socials">
                  <li>
                    <a href="/login">
                      <i className="display-flex-center zmdi zmdi-facebook" />
                    </a>
                  </li>
                  <li>
                    <a href="/login">
                      <i className="display-flex-center zmdi zmdi-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="/login">
                      <i className="display-flex-center zmdi zmdi-google" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(Login);
