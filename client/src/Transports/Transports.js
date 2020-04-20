import React, { Component } from 'react';
import axios from 'axios'

export default class Transports extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        axios.get('https://data.ratp.fr/api/datasets/1.0/search').then(res => {
            this.setState({ data: res.data })
            console.log(this.state.data)
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Transports</h1>
                    </div>
                </div>
            </div>
        )
    }
}