import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
                    {(this.props.location.pathname !== '/') &&
                        <i className="fas fa-home" onClick={() => this.props.history.push("/")}></i>}
                    {(this.props.location.pathname !== '/login') &&
                        <a className="login" onClick={() => this.props.history.push('/login')}>Log In</a>}
                    {(this.props.location.pathname !== '/register') &&
                        <a className="register" onClick={() => this.props.history.push('register')}>Register</a>}
                </div>
        } else if (this.props.location.pathname !== '/') {
            links =
                <i className="fas fa-home" onClick={() => this.props.history.push("/")}></i>
        }

        return (
            <div className="nav-links">
                {links}
            </div>
        )
    }
}

export default withRouter(Links)