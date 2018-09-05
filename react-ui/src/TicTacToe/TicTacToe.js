import React, { Component } from 'react';
import openSocket from 'socket.io-client';

export default class TicTacToe extends Component {
    componentDidMount() {
        const socket = openSocket('http://localhost:8080');
        socket.emit('message', "test message")
        socket.on('message', message => {
            console.log(message)
        })
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