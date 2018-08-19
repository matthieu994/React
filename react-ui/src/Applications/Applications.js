import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Applications.css';
import apps from './apps.json'
import verifAuth from '../Auth/verifAuth'

export class Applications extends Component {
    constructor() {
        super();
        this.state = {
            apps
        }
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
                <UserIcon />
                <div className="wrapper">
                    {this.renderApplications()}
                </div>
            </div>
        )
    }
}

class UserIconWithoutRouter extends Component {
    state = {
        redirect: false,
        isAuth: false,
        isMounted: false
    }

    componentDidMount() {
        verifAuth().then(isAuth => {
            this.setState({
                isMounted: true,
                isAuth
            })
        })
    }

    logout() {
        localStorage.clear('token');
        this.setState({
            isAuth: false
        })
        this.props.history.push("/");
    }

    redirectProfile() {
        this.props.history.push("/Profile");
    }

    render() {
        let links, user;
        if (!this.state.isAuth && this.state.isMounted) {
            links =
                <ul>
                    <li><Link to="/">Applications</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
        } else {
            links =
                <ul>
                    <li><Link to="/">Applications</Link></li>
                </ul>
            user =
                <div className="user">
                    {this.props.location.pathname !== '/Profile' && <i className="fas fa-user-circle" onClick={this.redirectProfile.bind(this)}></i>}
                    <a className="btn btn-info" onClick={this.logout.bind(this)}>Log Out</a>
                </div>
        }

        return (
            <div className="user-wrapper">
                <div className="nav-links">
                    {links}
                </div>
                {user}
            </div>
        )
    }
}
export const UserIcon = withRouter(UserIconWithoutRouter)

function FooterWithoutRouter() {
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
export const Footer = withRouter(FooterWithoutRouter)