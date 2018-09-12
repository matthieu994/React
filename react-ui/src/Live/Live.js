import React, { Component } from "react";
import "./Live.css";
import { ToastContainer, toast } from "react-toastify";
import { Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import p5 from "p5";
import sketch from "./sketch";

const DEV = false;
export default class Live extends Component {
	constructor() {
		super();
		this.socket = io("/Live");
		this.state = {
			code: "",
			mobile: false,
			linked: false,
			id: null
		};
	}
	loadSocket() {
		this.socket = io("/Live");
	}
	componentDidMount() {
		if (!this.socket) this.loadSocket();

		this.socket.on("getCode", code => {
			this.setState({ code });
		});

		this.socket.on("linkDone", res => {
			this.setState({ linked: true });
			console.log(res);
		});

		this.socket.on("noRoom", message => {
			toast.error(message);
		});

		this.socket.on("leave", () => {
			this.setState({ linked: false, mobile: false, code: "" });
			this.loadSocket();
		});

		if (DEV) {
			if (mobile()) {
				this.setState({
					mobile: true,
					code: "DEVCODE"
				});
			} else {
				this.setState({
					mobile: false
				});
				this.socket.emit("createCode");
			}
		} else {
			this.setState({ mobile: mobile(), code: "" });
			if (!mobile()) {
				this.generateCode();
			}
		}
	}
	componentWillUnmount() {
		this.socket.disconnect();
	}

	generateCode() {
		this.socket.emit("createCode");
	}
	mobile() {
		this.setState({ mobile: true });
	}

	enterCode(e) {
		e.preventDefault();
		if (!this.state.code) return;
		this.socket.emit("link", this.state.code);
	}

	leave() {
		this.socket.emit("leave", this.state.code);
		this.setState({ linked: false, mobile: false, code: "" });
	}

	render() {
		let input;
		if (!this.state.mobile && !this.state.linked) {
			input = (
				<div>
					<div>
						<span>{"#" + this.state.code}</span>
					</div>
					<button
						className="btn btn-outline-info mt-2"
						onClick={() => this.setState({ mobile: false, code: "" })}>
						Retour
					</button>
				</div>
			);
		}
		if (this.state.mobile && !this.state.linked) {
			input = (
				<div>
					<form>
						<input
							className="form-control"
							value={this.state.code}
							onChange={e => this.setState({ code: e.target.value.toUpperCase() })}
						/>
						<button
							className="btn btn-outline-primary ml-2"
							onClick={e => {
								this.enterCode(e);
							}}>
							Lier
						</button>
					</form>
					<button
						className="btn btn-outline-info mt-2"
						onClick={() => this.setState({ mobile: false, code: "" })}>
						Retour
					</button>
				</div>
			);
		}
		if (this.state.linked) {
			input = null;
		}

		return (
			<div className="container live">
				{this.state.linked && (
					<div className="row">
						<div className="col">
							<button className="btn btn-outline-info" onClick={() => this.leave()}>
								Retour
							</button>
						</div>
					</div>
				)}
				{!this.state.linked && (
					<div className="row">
						<div className="col">
							<div>
								<h1>Live</h1>
								{this.state.linked && <h2>#{this.state.code}</h2>}
							</div>
							{!this.state.code &&
								!this.state.mobile && (
									<div>
										<button
											className="btn btn-outline-primary mr-2"
											onClick={() => this.generateCode()}>
											Ordinateur
										</button>
										<button
											className="btn btn-outline-info"
											onClick={() => this.mobile()}>
											Mobile
										</button>
									</div>
								)}
							{(this.state.code || this.state.mobile) && input}
							<p className="mt-3">
								Connectez votre mobile et votre ordinateur à l'aide du code fourni.
							</p>
						</div>
					</div>
				)}
				{this.state.linked &&
					!this.state.mobile && (
						<Game
							id={this.state.id}
							code={this.state.code}
							mobile={this.state.mobile}
							socket={this.socket}
						/>
					)}
				{this.state.linked &&
					this.state.mobile && (
						<Commands
							code={this.state.code}
							mobile={this.state.mobile}
							socket={this.socket}
						/>
					)}
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
		foods: []
	};

	componentDidMount() {
		if (!this.props.socket) return;
		this.socket = this.props.socket;

		this.socket.emit("createBlob");
		this.socket.on("createBlob", data => {
			this.x = data.x;
			this.y = data.y;
		});

		this.socket.on("updatePos", data => {
			this.setState({ speedX: data.degX, speedY: data.degY });
		});

		this.socket.on("beat", data => {
			this.setState({ blobs: data.blobs, foods: data.foods });
			this.setState({ radius: this.findRadius() });
		});
	}

	findRadius() {
		if (!this.state.blobs || this.state.blobs.length < 1) {
			return 0;
		}

		let index = this.state.blobs.findIndex(blob => blob.id === this.socket.id);
		if (index > -1) return this.state.blobs[index].radius;
		else if (this.state.radius) {
			return this.leave();
		}
	}

	leave() {
		this.socket.emit("leave", this.props.code);
		return 0;
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
					speedX={this.state.speedX}
					speedY={this.state.speedY}
					radius={this.state.radius}
					blobs={this.state.blobs}
					foods={this.state.foods}
					initX={this.x}
					initY={this.y}
				/>
			</div>
		);
	}
}

class Commands extends Component {
	state = {
		alpha: 0,
		beta: 0,
		gamma: 0
	};

	componentDidMount() {
		this.socket = this.props.socket;
		this.handleOrientation();
		this.beat = setInterval(() => {
			this.socket.emit("updatePos", {
				code: this.props.code,
				beta: this.state.beta,
				gamma: this.state.gamma
			});
		}, 100);
	}
	handleOrientation() {
		window.addEventListener(
			"deviceorientation",
			e => {
				this.setState({ alpha: e.alpha, beta: e.beta, gamma: e.gamma });
			},
			true
		);
	}

	render() {
		return (
			<div>{this.state.alpha + "    " + this.state.beta + "    " + this.state.gamma}</div>
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
	}

	render() {
		return <div ref={wrapper => (this.wrapper = wrapper)} />;
	}
}

function mobile() {
	var check = false;
	(function(a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
				a
			) ||
			// eslint-disable-next-line
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}
