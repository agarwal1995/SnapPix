import React, { Component } from "react";
import signUpImg from "./../img/signup-image.jpg";
import "./../style.css";

import Firebase from "./../firebase/Firebase";

class Register extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    error: null
  };

  handleSubmit = event => {
    event.preventDefault();
    const { email, password, confirmPassword, error } = this.state;
    if (password !== confirmPassword) {
      this.error = "Password Should be same";
    } else {
      Firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          this.props.history.push("/login");
        })
        .catch(error => {
          this.setState({ error: error });
        });
    }
  };

  handleInputChange = event => {
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
    const { name, email, password, confirmPassword } = this.state;
    return (
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form
                method="POST"
                onSubmit={this.handleSubmit}
                className="register-form"
                id="register-form"
              >
                <div className="form-group">
                  <label htmlFor="name">
                    <i className="zmdi zmdi-account material-icons-name" />
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    id="name"
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="zmdi zmdi-email" />
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleInputChange}
                    id="email"
                    placeholder="Your Email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pass">
                    <i className="zmdi zmdi-lock" />
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleInputChange}
                    id="password"
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="re-pass">
                    <i className="zmdi zmdi-lock-outline" />
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={this.handleInputChange}
                    placeholder="Repeat your password"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="checkbox"
                    name="agree-term"
                    id="agree-term"
                    className="agree-term"
                  />
                  <label htmlFor="agree-term" className="label-agree-term">
                    <span>
                      <span />
                    </span>
                    I agree all statements in{" "}
                    <a href="/terms" className="term-service">
                      Terms of service
                    </a>
                  </label>
                </div>
                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    value="Register"
                  />
                </div>
              </form>
            </div>
            <div className="signup-image">
              <figure>
                <img src={signUpImg} alt="" />
              </figure>
              <a href="/login" className="signup-image-link">
                I am already member
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Register;
