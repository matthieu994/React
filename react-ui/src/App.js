import React, { Component } from 'react';
import './App.css';
import TodoList from './Todo/TodoList';
import API from './API/API';

class App extends Component {
  constructor() {
    super();
    this.state = {
      app: 'todolist'
    }
  }

  renderTodo() {
    this.setState({
      app: "todolist"
    })
  }

  renderAPI() {
    this.setState({
      app: "api"
    })
  }

  render() {
    let app;
    if (this.state.app === "todolist")
      app = <TodoList />;
    if (this.state.app === "api")
      app = <API />;
    return (
      <div>
        <div className="menu-navbar">
          <span onClick={this.renderTodo.bind(this)}>TodoList</span>
          <span onClick={this.renderAPI.bind(this)}>API</span>
        </div>
        <div>
          {app}
        </div>
      </div>
    );
  }
}

export default App;
