import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import PrivateRoute from './Auth/PrivateRoute';
import './App.css';
import TodoList from './Todo/TodoList';
import Login from './Auth/Login';
import Register from './Auth/Register';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/TodoList">Protected Page</Link></li>
          </ul>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <PrivateRoute path='/TodoList' component={TodoList} />
        </div>
      </Router>
    );
  }
}

export default App;
