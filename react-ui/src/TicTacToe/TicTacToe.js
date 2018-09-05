import React, { Component } from 'react';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

export default class TicTacToe extends Component {
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