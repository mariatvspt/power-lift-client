import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, Form, FormControl, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import { Auth } from "aws-amplify";
import "./App.css";
import Routes from "./Routes";

function App(props) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
  
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);

    props.history.push("/login");
  }
  
  return (
    !isAuthenticating && (
      <div className="App container">
        <Navbar bg="light" expand="lg" variant="light">
            <Navbar.Brand href="/"> PowerLift </Navbar.Brand>
            <Navbar.Toggle display="true" aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Link href="/settings"> Settings </Nav.Link>
                  <Nav.Link onClick={handleLogout}> Logout </Nav.Link>
                </>
              ) : (
                <NavDropdown className="TopDropDown" title="Select">
                  <NavDropdown.Item className="TopDropDownItem" href="/signup"> Signup </NavDropdown.Item>
                  <NavDropdown.Item className="TopDropDownItem" href="/login"> Login </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated }}
        >
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default withRouter(App);