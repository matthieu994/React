import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "./TicTacToe.css";
import { ToastContainer, toast } from "react-toastify";
import { Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

export default class TicTacToe extends Component {
	state = {
		room: "",
		joined: null,
		type: ""
	};

	constructor() {
		super();
		this.socket = io.connect();
	}

	componentDidMount() {
		const hash = window.location.hash;
		if (hash !== "") {
			this.socket.emit("joinRoom", hash.slice(1, hash.length));
			this.setState({ room: hash.slice(1, hash.length) });
		}
		this.socket.on("inRoom", msg => {
			toast.info(msg);
			this.setState({ joined: this.state.room });
		});
		this.socket.on("fullRoom", msg => {
			toast.error(msg);
			this.setState({ room: "" });
		});
		this.socket.on("playerIs", type => {
			this.setState({ type });
		});
	}

	componentWillUnmount() {
		this.socket.disconnect();
	}

	joinRoom(e) {
		e.preventDefault();
		if (isNaN(this.state.room) || this.state.room === "") toast.error("Salle non valide");
		else this.socket.emit("joinRoom", this.state.room);
	}

	render() {
		return (
			<div className="container tictactoe">
				<div className="row">
					<div className="col">
						<h1>Online TicTacToe</h1>
						{this.state.joined && <h4>Salle #{this.state.joined}</h4>}
						{!this.state.joined && (
							<form className="form-inline">
								<div className="form-group">
									<input
										placeholder="Salle"
										className="form-control"
										value={this.state.room}
										onChange={e => this.setState({ room: e.target.value })}
									/>
									<Button
										color="primary"
										className="ml-2"
										onClick={e => this.joinRoom(e)}>
										Rejoindre
									</Button>
								</div>
							</form>
						)}
						<Game
							joined={this.state.joined}
							type={this.state.type}
							socket={this.socket}
						/>
					</div>
				</div>
				<ToastContainer
					position="top-center"
					autoClose={2500}
					hideProgressBar={true}
					rtl={false}
					pauseOnHover={false}
					transition={Zoom}
				/>
			</div>
		);
	}
}

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
	}

	render() {
		return (
			<div className="d-inline-block">
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null)
				}
			],
			stepNumber: 0,
			xIsNext: true,
			start: false
		};
	}

	componentDidMount() {
		this.socket = this.props.socket;
		if (!this.socket) return;

		this.socket.on("nextPlayer", msg => {
			this.play(msg.i);
		});

		this.socket.on("start", () => {
			this.setState({ start: true });
		});
	}

	play(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i] || !this.state.start) {
			return;
		}

		if (this.props.type === "X") squares[i] = "O";
		else squares[i] = "X";

		this.setState({
			history: history.concat([
				{
					squares: squares
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i] || !this.state.start) {
			return;
		}
		if (
			(!this.state.xIsNext && this.props.type === "X") ||
			(this.state.xIsNext && this.props.type === "O")
		)
			return;

		squares[i] = this.props.type;

		this.setState({
			history: history.concat([
				{
					squares: squares
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});

		this.socket.emit("play", {
			room: this.props.joined,
			i,
			xIsNext: this.state.xIsNext
		});
	}

	render() {
		if (!this.props.joined) return null;
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		let status;
		if (winner) {
			status = "Winner: " + winner;
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}
		if (!this.state.start) {
			status = "En attente d'un joueur";
		}

		return (
			<div className="game">
				<div className="game-board">
					<span>Vous êtes: {this.props.type}</span>
					<div>{status}</div>
					<Board squares={current.squares} onClick={i => this.handleClick(i)} />
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
