import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login"
import AppliedRoute from "./components/AppliedRoute";
import Signup from "./containers/Signup";
import Home from "./containers/Home";
import Play from "./containers/Play";
import Settings from "./containers/Settings";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
      <AppliedRoute path="/signup" exact component={Signup} appProps={appProps} />
      <Route exact path="/settings">
        <Settings />
      </Route>
      <Route exact path="/play/:set">
        <Play />
      </Route>
      {/* <Route exact path="/notes/:id">
        <Notes />
      </Route> */}
      <Route component={NotFound} /> { /* Finally, catch all unmatched routes. Needs to be in the last line. */ }
    </Switch>
  );
}