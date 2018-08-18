import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        }
    }

    register(e) {
        e.preventDefault();
        console.log(this.state);
        axios.post('/register', this.state)
            .then((res) => {
                console.log(res.data)
            })
            .catch(err => console.log(err));
    }

    render() {
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
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Password" />
                </div>
                <div className="form-group row">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={this.register.bind(this)}>
                        Créer un compte</button>
                    <Link to="/login">J'ai déjà un compte</Link>
                </div>
            </form>
        )
    }
}

export default Register;