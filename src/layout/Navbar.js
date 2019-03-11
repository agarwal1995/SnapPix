import React, { Component } from "react";
import { Navbar, NavbarBrand, NavItem, NavLink, Nav } from "reactstrap";
import logo from "./../img/logo.svg";
import Firebase from "./../firebase/Firebase";

const pixStyle = {
  verticalAlign: "middle",
  fontSize: "20px",
  color: "black",
  fontWeight: "bold"
};

const authStyle = {
  verticalAlign: "middle",
  fontSize: "15px",
  color: "black",
  fontWeight: "bold"
};

class Navbars extends Component {
  state = {
    authenticated: false
  };

  onLogoutClick = () => {
    Firebase.auth().signOut();
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
    const { authenticated } = this.state;

    const userLinks = (
      <Nav>
        <NavItem>
          <NavLink href="/feeds" style={authStyle}>
            Feed
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/profile" style={authStyle}>
            Profile
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/" style={authStyle} onClick={this.onLogoutClick}>
            Logout
          </NavLink>
        </NavItem>
      </Nav>
    );

    const guestLinks = (
      <Nav>
        <NavItem key={userLinks}>
          <NavLink href="/login" style={authStyle}>
            Login
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/register" style={authStyle}>
            Register
          </NavLink>
        </NavItem>
      </Nav>
    );

    return (
      <div>
        <Navbar color="secondary" light expand="md">
          <img src={logo} width="30" height="30" alt="Snap" />
          <NavbarBrand href="/" style={pixStyle}>
            &nbsp;SnapPix
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            {authenticated ? userLinks : guestLinks}
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default Navbars;
