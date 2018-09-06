import React, { Component } from 'react';
import './Live.css'
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

export default class Live extends Component {
    constructor() {
        super()
        this.socket = io()
        this.state = {
            orientation: []
        }
    }
    componentDidMount() {
        window.addEventListener("deviceorientation", (e) => this.handleOrientation, true);
    }
    componentWillUnmount() {
        window.removeEventListener("deviceorientation", (e) => this.handleOrientation);
    }

    handleOrientation(e) {
        this.setState({ orientation: e })
        console.log(this.state.orientation)
    }

    render() {
        return (
            <div className="container tictactoe">
                <div className="row">
                    <div className="col">
                        <h1>Live</h1>
                        {this.state.orientation}
                    </div>
                </div>
            </div>
        )
    }
}