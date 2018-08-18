import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
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
        // if (this.state.redirect) {
        //     return <Redirect to={from} />
        // }

        return (
            <form>
                <div className="form-group">
                    <label>Pseudo</label>
                    <input type="text" className="form-control" placeholder="Pseudo" onChange={(e) => this.setState({ username: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Password" onChange={(e) => this.setState({ password: e.target.value })} />
                </div>
                <div className="form-group row">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={this.login.bind(this)}>
                        Se connecter</button>
                    <Link to="/register">Je n'ai pas de compte</Link>
                </div>
            </form>
        )
    }
}

export default Login;