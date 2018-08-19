import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivateRoute from './Auth/PrivateRoute';
import { Applications } from './Applications/Applications'
import TodoList from './Todo/TodoList';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Profile from './Profile/Profile.js'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact component={Applications} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <PrivateRoute path='/TodoList' component={TodoList} />
          <Route path='/Profile' component={Profile} />
        </div>
      </Router>
    );
  }
}

export default App;
