import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import './Login.css'
import axios from 'axios';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            redirect: false
        }
    }

    login(e) {
        e.preventDefault();
        axios.post('/login', this.state)
            .then((res) => {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    this.setState({
                        redirect: true
                    })
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        // const { from } = this.props.location.state || { from: { pathname: '/' } }
        if (this.state.redirect) {
            return <Redirect to='/' />
        }

        return (
            <div className="connect">
                <form>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Pseudo" onChange={(e) => this.setState({ username: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Mot de passe" onChange={(e) => this.setState({ password: e.target.value })} />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={this.login.bind(this)}>
                        Se connecter</button>
                    <Link to="/register">Je n'ai pas de compte</Link>
                </form>
            </div>
        )
    }
}

export default withRouter(Login);