import React, { Component } from "react";
import "./Live.css";
import { ToastContainer } from "react-toastify";
import { Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import p5 from "p5";
import sketch from "./sketch";

export default class Live extends Component {
	constructor() {
		super();
		this.socket = io("/Live");
	}

	leave() {
		this.update = true
		this.forceUpdate()
		this.socket.disconnect();
	}

	componentWillUnmount() {
		this.socket.disconnect();
	}

	render() {
		return (
			<div className="container live">
				<div className="row">
					<div className="col">
						<button className="btn btn-outline-info" onClick={() => this.leave()}>
							Retour
						</button>
					</div>
				</div>
				<Game socket={this.socket} props={this.update}/>
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

class Game extends Component {
	state = {
		speedX: 0,
		speedY: 0,
		radius: 0,
		blobs: [],
		foods: [],
		viruses: []
	};

	componentDidMount() {
		this.socket = this.props.socket;

		this.socket.emit("createBlob");
		this.socket.on("createBlob", data => {
			this.x = data.x;
			this.y = data.y;
			this.width = data.width
			this.height = data.height
		});

		this.socket.on("beat", data => {
			this.setState({ blobs: data.blobs, foods: data.foods, viruses: data.viruses });
			this.setState({ radius: this.findRadius() });
		});
	}

	componentWillReceiveProps(props) {
		if(props.update) this.forceUpdate()
		this.socket.disconnect();
	}

	findRadius() {
		if (!this.state.blobs || this.state.blobs.length < 1) {
			return 0;
		}

		let index = this.state.blobs.findIndex(blob => blob.id === this.socket.id);
		if (index > -1) return this.state.blobs[index].radius;
		else if (this.state.radius) {
			window.location.reload()
			this.socket.disconnect();
		}
	}

	componentWillUnmount() {
		this.socket.disconnect();
	}

	render() {
		return (
			<div className="live-game">
				<P5Wrapper
					socket={this.socket}
					sketch={sketch}
					radius={this.state.radius}
					blobs={this.state.blobs}
					foods={this.state.foods}
					viruses={this.state.viruses}
					initX={this.x}
					initY={this.y}
					width={this.width}
					height={this.height}
				/>
			</div>
		);
	}
}

class P5Wrapper extends React.Component {
	componentDidMount() {
		this.canvas = new p5(this.props.sketch, this.wrapper);
		if (this.canvas.myCustomRedrawAccordingToNewPropsHandler) {
			this.canvas.myCustomRedrawAccordingToNewPropsHandler(this.props);
		}
	}

	componentWillReceiveProps(newprops) {
		if (this.props.sketch !== newprops.sketch) {
			this.wrapper.removeChild(this.wrapper.childNodes[0]);
			this.canvas = new p5(newprops.sketch, this.wrapper);
		}
		if (this.canvas.myCustomRedrawAccordingToNewPropsHandler) {
			this.canvas.myCustomRedrawAccordingToNewPropsHandler(newprops);
		}
	}

	componentWillUnmount() {
		this.canvas.remove();
		this.socket.disconnect();
	}

	render() {
		return <div ref={wrapper => (this.wrapper = wrapper)} />;
	}
}
