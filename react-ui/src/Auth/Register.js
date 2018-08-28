import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            password2: '',
            alerts: []
        }
    }

    register(e) {
        e.preventDefault();
        console.log(this.state);
        if (this.state.username.trim().length < 3)
            return this.alert("Un pseudo doit faire plus de 3 caractères");
        if (this.state.password.trim().length < 3)
            return this.alert("Le mot de passe doit faire plus de 3 caractères");
        if (this.state.password.trim().length !== this.state.password2.trim().length)
            return this.alert("Les mots de passe doivent être identiques");

        axios.post('/register', this.state)
            .then((res) => {
                console.log(res.data)
                this.alert(res.data.message)
            })
            .catch(err => console.log(err));
    }

    alert(message) {
        if (this.state.alerts.length > 0)
            return

        this.setState({
            alerts: [...this.state.alerts, message]
        })
        setTimeout(() => {
            this.setState({
                alerts: []
            })
        }, 3000)
    }

    renderAlerts() {
        return (
            <div>
                {this.state.alerts.map((el, index) => {
                    return (
                        <span key={index}>{el}</span>
                    )
                })
                }
            </div>
        )
    }

    render() {
        return (
            <div>
                <section className="alerts">
                    {this.renderAlerts()}
                </section>
                <div className="connect">
                    <form>
                        <div className="form-group">
                            <input type="text" status="correct" className="form-control" placeholder="Pseudo" required onChange={(e) => this.setState({ username: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Mot de passe" required onChange={(e) => this.setState({ password: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Mot de passe" required onChange={(e) => this.setState({ password2: e.target.value })} />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={this.register.bind(this)}>
                            Créer un compte</button>
                        <Link to="/login">J'ai déjà un compte</Link>
                    </form>
                </div>
            </div>
        )
    }
}

export default Register;