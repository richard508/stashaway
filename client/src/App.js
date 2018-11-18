import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import LogInPage from './components/LogInPage'
import StashPage from './components/StashPage'
import NavBar from './components/NavBar';

const Global = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Poppins');

body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background: #A8DADC;
}
`
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Global />
          <NavBar />
          <Switch>
            <Route exact path="/users/:userId" component={StashPage}/>
            <Route path="/" component={LogInPage}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
