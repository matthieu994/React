import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import PrivateRoute from "./Auth/PrivateRoute";
import Applications from "./Components/Applications";
import TodoList from "./Todo/TodoList";
import Profile from "./Profile/Profile";
import Transports from "./Transports/Transports";
import TicTacToe from "./TicTacToe/TicTacToe";
import AgarClone from "./AgarClone/AgarClone";
import Chat from "./Chat/Chat";
import EventPlanner from "./Event/Event";
import CV from "./CV";
import Portfolio from "./Portfolio/";

class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/" exact component={Applications} />
                    <Route path="/login" component={Applications} />
                    <Route path="/register" component={Applications} />
                    <Route path="/TicTacToe" component={TicTacToe} />
                    <Route path="/CV" component={CV} />
                    <PrivateRoute path="/Portfolio" component={Portfolio} />
                    <PrivateRoute path="/Profile" component={Profile} />
                    <PrivateRoute path="/TodoList" component={TodoList} />
                    <PrivateRoute path="/Transports" component={Transports} />
                    <PrivateRoute path="/Chat" component={Chat} />
                    <PrivateRoute path="/AgarClone" component={AgarClone} />
                    <PrivateRoute path="/Event" component={EventPlanner} />
                    <Redirect to="/" />
                </Switch>
            </div>
        );
    }
}

export default App;
