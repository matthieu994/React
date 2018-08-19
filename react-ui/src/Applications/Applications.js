import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Applications.css';
import apps from './apps.json'
import verifAuth from '../Auth/verifAuth'

export class Applications extends Component {
    constructor() {
        super();
        this.state = {
            apps,
            isAuth: false
        }
    }

    logout() {
        localStorage.clear('token')
    }

    componentDidMount() {
        verifAuth().then(isAuth => {
            if (isAuth)
                this.setState({
                    isAuth
                })
        })
    }

    renderApplications() {
        return this.state.apps.map((app, index) => {
            return (
                <div className="card" key={index}>
                    <div className="card-body">
                        <h5 className="card-title">{app.title}</h5>
                        <p className="card-text">{app.desc}</p>
                    </div>
                    <div className="card-bottom">
                        <Link className="btn btn-primary" to='/TodoList'>Y aller !</Link>
                    </div>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                {this.state.isAuth && <UserIcon />}
                <ul>
                    <li><Link to="/">Applications</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><a href='' onClick={this.logout.bind(this)}>Log Out</a></li>
                </ul>
                <div className="wrapper">
                    {this.renderApplications()}
                </div>
            </div>
        )
    }
}

export class UserIcon extends Component {
    state = {
        redirect: false
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/Profile' />
        }

        return (
            <div className="userIcon">
                <i className="fas fa-user-circle" onClick={() => this.setState({ redirect: true })}></i>
            </div>
        )
    }
}

export function Footer() {
    return (
        <footer className="page-footer text-light p-3">
            <div className="container-fluid text-center">
                <div className="row">
                    <h3 className="col font-weight-bold">Applications</h3>
                </div>
                <div className="row">
                    {
                        apps.map((app, index) =>
                            <div className="col" key="index">
                                <Link to={app.Component}>{app.title}</Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </footer>
    )
}