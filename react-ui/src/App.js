import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import TodoList from './Todo/TodoList';
import Login from './Auth/Login';
import Register from './Auth/Register';

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/" component={TodoList} />
        </Switch>
      </Router>
    );
  }
}

export default App;
