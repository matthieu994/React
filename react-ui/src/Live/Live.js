import React, { Component } from 'react';
import './Live.css'
import { ToastContainer, toast } from 'react-toastify';
import { Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

const SPRITE = "https://vignette.wikia.nocookie.net/theunitedorganizationtoonsheroes/images/4/48/Yoshi.png/revision/latest?cb=20160502152521"
export default class Live extends Component {
    constructor() {
        super()
        this.socket = io('/Live')
        this.state = {
            code: '',
            mobile: false,
            linked: false
        }
    }
    componentDidMount() {
        this.socket.on('getCode', (code) => {
            this.setState({ code })
        })

        this.socket.on('linkDone', (res) => {
            this.setState({ linked: true })
            console.log(res)
        })

        this.socket.on('noRoom', message => {
            toast.error(message)
        })
    }
    componentWillUnmount() {
        this.socket.disconnect()
    }

    generateCode() {
        this.socket.emit('createCode')
    }
    mobile() {
        this.setState({ mobile: true })
    }

    enterCode(e) {
        e.preventDefault()
        if (!this.state.code) return
        this.socket.emit('link', this.state.code)
    }

    render() {
        let input;
        if (!this.state.mobile && !this.state.linked) {
            input =
                <div>
                    <h4>{'#' + this.state.code}</h4>
                </div>
        }
        if (this.state.mobile && !this.state.linked) {
            input =
                <form>
                    <input className="form-control" value={this.state.code}
                        onChange={(e) => this.setState({ code: e.target.value.toUpperCase() })} />
                    <button className="btn btn-outline-primary ml-2"
                        onClick={e => { this.enterCode(e) }}
                    >Lier</button>
                </form>
        }
        if (this.state.linked) {
            input = null;
        }

        return (
            <div className="container live">
                <div className="row">
                    <div className="col">
                        <div className="status">
                            <h1>Live</h1>{this.state.linked && <h2>#{this.state.code}</h2>}
                        </div>
                        {!this.state.code && !this.state.mobile &&
                            <div>
                                <button className="btn btn-outline-primary mr-2" onClick={() => this.generateCode()}>Ordinateur</button>
                                <button className="btn btn-outline-info" onClick={() => this.mobile()}>Mobile</button>
                            </div>
                        }
                        {(this.state.code || this.state.mobile) && input}
                    </div>
                </div>
                {this.state.linked && !this.state.mobile && <Game code={this.state.code} mobile={this.state.mobile} socket={this.socket} />}
                {this.state.linked && this.state.mobile && <Commands code={this.state.code} mobile={this.state.mobile} socket={this.socket} />}
                <ToastContainer
                    position="top-center"
                    autoClose={2500}
                    hideProgressBar={true}
                    rtl={false}
                    pauseOnHover={false}
                    transition={Zoom}
                />
            </div>
        )
    }
}

class Game extends Component {
    state = {
        direction: ''
    }

    componentDidMount() {
        this.socket = this.props.socket;
        this.socket.on('updatePos', direction => {
            this.setState({ direction })
        })
    }

    render() {
        return (
            <div className="live-game">
                <Image direction={this.state.direction} />
            </div>
        )
    }
}

class Image extends Component {
    state = {
        x: 0,
        y: 0,
    }

    componentWillReceiveProps(newProps) {
        // console.log(newProps)
        if (newProps.direction === 'left')
            this.setState({ x: this.state.x - 10 })
        if (newProps.direction === 'right')
            this.setState({ x: this.state.x + 10 })
        if (newProps.direction === 'up')
            this.setState({ y: this.state.y - 10 })
        if (newProps.direction === 'down')
            this.setState({ y: this.state.y + 10 })
    }

    render() {
        let style = {
            left: this.state.x,
            top: this.state.y
        }
        return (
            <img style={style} src={SPRITE} alt='character'></img>
        )
    }
}

class Commands extends Component {
    state = {
        alpha: null,
        beta: null,
        gamma: null
    }

    componentDidMount() {
        this.socket = this.props.socket;
        this.handleOrientation()
        this.beat = setInterval(() => {
            this.socket.emit('updatePos', {
                code: this.props.code,
                beta: this.state.beta,
                gamma: this.state.gamma
            })
        }, 100)
    }
    handleOrientation() {
        window.addEventListener("deviceorientation", e => {
            this.setState({ alpha: e.alpha, beta: e.beta, gamma: e.gamma })
        }, true);
    }

    move(direction) {
        this.socket.emit('updatePos', {
            code: this.props.code,
            direction
        })
    }
    moveDebug(e) {
        let dir;
        if (e.keyCode === 37)
            dir = 'left'
        if (e.keyCode === 39)
            dir = 'right'
        if (e.keyCode === 38)
            dir = 'up'
        if (e.keyCode === 40)
            dir = 'down'
        this.socket.emit('updatePos', {
            code: this.props.code,
            direction: dir
        })
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={() => this.move('left')}>Gauche</button>
                    <button onClick={() => this.move('right')}>Droite</button>
                    <button onClick={() => this.move('up')}>Haut</button>
                    <button onClick={() => this.move('down')}>Bas</button>
                    <input placeholder="debug" type="text" onKeyDown={e => this.moveDebug(e)} />
                </div>
                {this.state.alpha + ' ' + this.state.beta + ' ' + this.state.gamma}
            </div>
        )
    }
}