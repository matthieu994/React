import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import PrivateRoute from "./Auth/PrivateRoute";
import { Applications } from "./Components/Applications";
import TodoList from "./Todo/TodoList";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Profile from "./Profile/Profile";
import Transports from "./Transports/Transports";
import TicTacToe from "./TicTacToe/TicTacToe";
import AgarClone from "./AgarClone/AgarClone";
import Chat from "./Chat/Chat";

class App extends Component {
	render() {
		return (
			<div>
				{/* <Switch> */}
					<Route path="/" exact component={Applications} />
					<Route path="/register" component={Register} />
					<Route path="/login" component={Login} />
					<PrivateRoute path="/profile" component={Profile} />
					<PrivateRoute path="/TodoList" component={TodoList} />
					<PrivateRoute path="/Transports" component={Transports} />
					<PrivateRoute path="/TicTacToe" component={TicTacToe} />
					<PrivateRoute path="/AgarClone" component={AgarClone} />
					<PrivateRoute path="/Chat" component={Chat} />
					{/* <Redirect to="/" /> */}
				{/* </Switch> */}
			</div>
		);
	}
}

export default App;
