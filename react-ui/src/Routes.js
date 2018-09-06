import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PrivateRoute from './Auth/PrivateRoute';
import { Applications } from './Components/Applications'
import TodoList from './Todo/TodoList';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Profile from './Profile/Profile'
import Transports from './Transports/Transports'
import TicTacToe from './TicTacToe/TicTacToe'
import Live from './Live/Live'

class App extends Component {
  render() {
    return (
        <div>
          <Route path="/" exact component={Applications} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <PrivateRoute path='/profile' component={Profile} />
          <PrivateRoute path='/TodoList' component={TodoList} />
          <PrivateRoute path='/Transports' component={Transports} />
          <PrivateRoute path='/TicTacToe' component={TicTacToe} />
          <PrivateRoute path='/Live' component={Live} />
        </div>
    );
  }
}

export default App;
