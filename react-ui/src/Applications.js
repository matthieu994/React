import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './App.css';
import TodoList from './Todo/TodoList';

class Applications extends Component {
    constructor() {
        super();
        this.state = {
            apps: [
                {
                    title: 'TodoList',
                    desc: "Créer et partagez votre liste de courses, de choses à faire, de films à voir...",
                    Component: TodoList
                },
                {
                    title: 'Exemple',
                    desc: "Description d'application exemple...",
                    Component: TodoList
                },{title: 'test'},{title: 'test'},{title: 'test'},{title: 'test'},{title: 'test'}
            ]
        }
    }

    logout() {
        localStorage.clear('token')
    }

    renderApplications() {
        return this.state.apps.map((app, index) => {
            return (
                <div className="card" key={index}>
                    <div className="card-body">
                        <h5 className="card-title">{app.title}</h5>
                        <p className="card-text">{app.desc}</p>
                        <Link className="btn btn-primary" to='/TodoList'>Y aller !</Link>
                    </div>
                </div>
            )
        })
    }

    render() {
        console.log(this.state)
        return (
            <div>
                <ul>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/TodoList">Protected Page</Link></li>
                    <li><a href='' onClick={this.logout.bind(this)}>Log Out</a></li>
                </ul>
                <div className="wrapper">
                    {this.renderApplications()}
                </div>
            </div>
        )
    }
}

export default Applications;
