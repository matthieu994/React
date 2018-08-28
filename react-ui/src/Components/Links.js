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
            if (this.props.location.pathname === '/login') {
                links =
                    <div className="register">
                        <span>Pas de compte ?</span>
                        <button onClick={() => this.props.history.push('/register')}>S'inscrire</button>
                    </div>
            }
            else if (this.props.location.pathname === '/register') {
                links =
                    <div className="login">
                        <span>Déjà inscrit ?</span>
                        <button onClick={() => this.props.history.push('/login')}>Se connecter</button>
                    </div>
            }
            else {
                links =
                    <div className="auth">
                        <button className="btn btn-outline-primary" onClick={() => this.props.history.push('/login')}>Se connecter</button>
                        <button className="btn btn-outline-primary" onClick={() => this.props.history.push('register')}>S'inscrire</button>
                    </div>
            }
        }

        return (
            <div>
                <div className="nav-links">
                    {links}
                </div>
                {this.props.location.pathname !== '/' &&
                    <i className="fas fa-home btn btn-outline-primary" onClick={() => this.props.history.push("/")}></i>}
            </div>
        )
    }
}

export default withRouter(Links)