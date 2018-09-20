import React, { Component, Fragment } from 'react';
import Routes from './Routes';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from "aws-amplify";

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
      };
  }
  async componentDidMount() {

    try {
      if (await Auth.currentSession()) {
      this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      if (e !== 'No current user') {
      alert(e);
      }
    }
    
    this.setState({ isAuthenticating: false });
  }
  handleLogout = async event => {
    await Auth.signOut();
    
    this.userHasAuthenticated(false);
  }
  changePassword = event => {
    Auth.currentAuthenticatedUser()
    .then(user => {
        return Auth.changePassword(user, 'abc123456', 'abcd12345');
    })
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
          <Nav pullRight>
            {this.state.isAuthenticated ? <NavItem onClick={this.changePassword}>Logout</NavItem> : <Fragment>
                <LinkContainer to="/signup">
                <NavItem>Signup</NavItem>
                </LinkContainer>
                <LinkContainer to="/login">
                <NavItem>Login</NavItem>
              </LinkContainer>
            </Fragment>
            }
          </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default App;