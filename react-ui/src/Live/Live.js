import React, { Component } from 'react';
import './Live.css'
import { ToastContainer, toast } from 'react-toastify';
import { Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch'

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

        this.socket.on('leave', () => {
            this.setState({ linked: false, mobile: false, code: '' })
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

    leave() {
        this.socket.emit('leave', this.state.code)
        this.setState({ linked: false, mobile: false, code: '' })
    }

    render() {
        let input;
        if (!this.state.mobile && !this.state.linked) {
            input =
                <div>
                    <div>
                        <span>{'#' + this.state.code}</span>
                    </div>
                    <button className="btn btn-outline-info mt-2" onClick={() => this.setState({ mobile: false, code: '' })}>Retour</button>
                </div>
        }
        if (this.state.mobile && !this.state.linked) {
            input =
                <div>
                    <form>
                        <input className="form-control" value={this.state.code}
                            onChange={(e) => this.setState({ code: e.target.value.toUpperCase() })} />
                        <button className="btn btn-outline-primary ml-2"
                            onClick={e => { this.enterCode(e) }}
                        >Lier</button>
                    </form>
                    <button className="btn btn-outline-info mt-2" onClick={() => this.setState({ mobile: false, code: '' })}>Retour</button>
                </div>
        }
        if (this.state.linked) {
            input = null;
        }

        return (
            <div className="container live">
                <div className="row">
                    <div className="col">
                        <div>
                            <h1>Live</h1>{this.state.linked && <h2>#{this.state.code}</h2>}
                        </div>
                        {this.state.linked && <button className="btn btn-outline-info" onClick={() => this.leave()}>Retour</button>}
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
        x: 0,
        y: 0,
        speedX: 0,
        speedY: 0
    }

    componentDidMount() {
        if (!this.props.socket) return;
        this.socket = this.props.socket;

        this.socket.on('updatePos', data => {
            this.setState({ speedX: data.degX, speedY: data.degY })
        })

        this.prevTime = new Date().getTime()
        setInterval(() => this.move(), 20)
    }

    move() {
        const currentTime = new Date().getTime(), deltaTime = currentTime - this.prevTime;
        let x = this.state.x + parseFloat(this.state.speedX, 10) / 50 * deltaTime,
            y = this.state.y + parseFloat(this.state.speedY, 10) / 50 * deltaTime;
        this.setState({ x, y })
        this.prevTime = currentTime;
    }

    render() {
        return (
            <div className="live-game">
                <P5Wrapper sketch={sketch} x={this.state.x} y={this.state.y} />
                {/* <Image x={this.state.x} y={this.state.y} /> */}
            </div>
        )
    }
}

// eslint-disable-next-line
class Image extends Component {
    render() {
        let style = {
            left: this.props.x,
            top: this.props.y
        }
        return (
            <img style={style} src={SPRITE} alt='character'></img>
        )
    }
}

class Commands extends Component {
    state = {
        alpha: 0,
        beta: 0,
        gamma: 0
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

    render() {
        return (
            <div>
                {this.state.alpha + '    ' + this.state.beta + '    ' + this.state.gamma}
            </div>
        )
    }
}