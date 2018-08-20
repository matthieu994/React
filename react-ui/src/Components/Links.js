import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import verifAuth from '../Auth/verifAuth'
import './Links.css'

class Links extends Component {
    state = {
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

    render() {
        let links;
        if (this.state.isMounted && !localStorage.getItem('token')) {
            links =
                <div>
                    <i className="btn btn-primary fas fa-home" onClick={() => this.props.history.push("/")}></i>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </div>
        } else if (this.props.location.pathname !== '/') {
            links =
                <i className="btn btn-primary fas fa-home" onClick={() => this.props.history.push("/")}></i>
        }

        return (
            <div className="nav-links">
                {links}
            </div>
        )
    }
}

export default withRouter(Links)