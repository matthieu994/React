import React, { Component } from 'react';
import openSocket from 'socket.io-client';

export default class TicTacToe extends Component {
    componentDidMount() {
        const socket = openSocket();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Online TicTacToe</h1>
                    </div>
                </div>
            </div>
        )
    }
}