import React, { Component } from 'react'
import './Alerts.css'

export default class Alerts extends Component {
    renderAlert() {
        let message;

        if (this.props.message === "USERNAME_SHORT")
            message = "Votre pseudo doit faire plus de 3 caractères."
        else if (this.props.message === "USERNAME_MATCH")
            message = "Ce pseudo existe déjà."
        else if (this.props.message === "PASSWORD_SHORT")
            message = "Le mot de passe doit faire plus de 3 caractères."
        else if (this.props.message === "PASSWORD_MATCH")
            message = "Les mots de passe doivent être identiques."
        else {
            message = this.props.message
        }

        if (!message) return null;

        return (
            <div>
                <span>
                    {message}
                </span>
            </div>
        )
    }

    render() {
        return (
            <section className="alerts">
                {this.renderAlert()}
            </section>
        )
    }
}