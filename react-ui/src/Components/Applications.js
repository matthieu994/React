import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Applications.css';
import apps from './apps.json'

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
                <div className="wrapper">
                    {this.renderApplications()}
                </div>
            </div>
        )
    }
}