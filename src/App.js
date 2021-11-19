
import React, { useEffect, useState } from "react";

// pages for this product
import LandingPage from "views/LandingPage/LandingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import SignupPage from "views/SignupPage/SignupPage.js";

import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

var hist = createBrowserHistory();

function App() {

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) setIsLogged(true);
    // eslint-disable-next-line
  }, [isLogged])

  return (
    <div className="App">
      <Router history={hist}>
        <Switch>
          {isLogged ? (
            <>
              <Route exact path="/">
                <ProfilePage setIsLogged={setIsLogged} />
              </Route>
            </>
          ) : (
            <>
              <Route exact path="/" component={LandingPage} />
              <Route path="/login-page">
                <LoginPage setIsLogged={setIsLogged} />
              </Route>
              <Route path="/signup-page">
                <SignupPage setIsLogged={setIsLogged} />
              </Route>
            </>
          )}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
