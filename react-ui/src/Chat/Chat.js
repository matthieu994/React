import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import io from "socket.io-client";
import { DEFAULT_IMG } from "../Const/const";
import "./Chat.css";

class Chat extends Component {
	constructor() {
		super();
		this.state = {
			conversations: [],
			conversation: "",
			friends: [],
			new: ""
		};
	}

	componentDidMount() {
		Axios.defaults.headers.common["token"] = localStorage.getItem("token");
		this.updateDimensions();
		this.socket = io("/Chat", {
			transportOptions: {
				polling: {
					extraHeaders: {
						token: localStorage.getItem("token")
					}
				}
			}
		});

		window.addEventListener("resize", this.updateDimensions);

		this.socket.on("connect", () => {
			this.getData().then(() => {
				this.handleUrl();
			});
		});

		this.socket.on("newMessage", data => {
			let conversations = this.state.conversations;
			conversations.find(convo => convo._id === data.id).messages.push(data.message);
			this.setState({
				conversations
			});
			this.scrollBottom();
		});
	}

	componentWillReceiveProps() {
		this.handleUrl();
	}

	componentWillUnmount() {
		this.socket.disconnect();
		window.removeEventListener("resize", this.updateDimensions);
	}

	componentDidUpdate() {
		if (this.state.conversation >= 0) {
			this.scrollBottom();
		}
	}

	updateDimensions() {
		const padding = 50;
		document.querySelector(".chat").style.padding =
			padding / 2 + "px " + padding * 2 + "px";
		document.querySelectorAll(".chat .row > div").forEach(el => {
			el.style.height =
				window.innerHeight -
				padding -
				document.querySelector("header").clientHeight +
				"px";
		});
	}

	scrollBottom() {
		let el = document.querySelector(".messages");
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}

	findConversation(name) {
		if (this.state.conversations.length < 1) return;
		let convo;
		this.state.conversations.forEach((conversation, index) => {
			conversation.users.forEach(user => {
				if (user === name && user !== this.username) convo = index;
			});
		});
		return convo;
	}

	handleUrl() {
		if (!this.state.friends || !window.location.hash) return;

		let hash = window.location.hash.substr(1);
		let conversation = this.findConversation(hash);
		if (conversation >= 0 && conversation !== this.state.conversation) {
			this.setState({
				new: "",
				conversation
			});
		} else if (conversation === undefined) {
			let friend = this.state.friends.find(friend => friend._id === hash);
			if (!friend) {
				this.props.history.push(`#`);
			} else if (friend !== this.state.new) {
				this.setState({
					new: friend,
					conversation: ""
				});
				this.renderConversation();
			}
		}
	}

	async getData() {
		return await Axios.get("/Chat/data", {
			params: {
				socket: this.socket.id
			}
		}).then(data => {
			this.username = data.data.username;
			this.setState({
				friends: data.data.friends,
				conversations: data.data.conversations
			});
		});
	}

	renderConversationsList() {
		if (this.state.conversations.length === 0) return this.renderFriendsList();
		return [
			this.state.conversations.map((conversation, index) => {
				if (!conversation) return null;
				let friend;
				if (conversation.users.length === 2) {
					friend = conversation.users.filter(user => user !== this.username);
				}
				return (
					<div
						key={index}
						onClick={() => {
							this.state.conversation !== index &&
								this.props.history.push(
									`#${this.state.friends.find(user => user._id === friend[0])._id}`
								);
						}}>
						<div className="img-container">
							<img
								alt="conversation"
								src={
									this.state.friends.find(user => user._id === friend[0]).url ||
									DEFAULT_IMG
								}
							/>
						</div>
						<div className="text-container">
							<span>{this.state.friends.find(user => user._id === friend[0])._id}</span>
							<span>
								{conversation.messages[conversation.messages.length - 1].message}
							</span>
						</div>
					</div>
				);
			}),
			this.renderFriendsList()
		];
	}

	handleKey(e) {
		if (e.keyCode === 13) {
			if (e.ctrlKey) {
				let el = document.querySelector(".text-input textarea");
				el.value =
					el.value.substr(0, el.selectionStart) +
					"\n" +
					el.value.substr(el.selectionStart);
			} else this.sendMessage(e);
		}
	}

	renderInput() {
		return (
			<form key="form" className="text-input">
				<textarea type="text" onKeyDown={e => this.handleKey(e)} />
				<button className="btn btn-primary" onClick={e => this.sendMessage(e)}>
					Envoyer
				</button>
			</form>
		);
	}

	sendMessage(e) {
		e.preventDefault();
		let input = document.querySelector(".text-input textarea");
		if (input.value.trim() === "") return;
		if (this.state.new) return this.createConversation(input);
		this.socket.emit("sendMessage", {
			conversation: this.state.conversations[this.state.conversation]._id,
			message: input.value.trim(),
			sender: this.username
		});
		input.value = "";
	}

	createConversation(input) {
		this.socket.emit(
			"createConversation",
			{
				message: input.value,
				user: this.state.new._id
			},
			data => {
				this.getData().then(() => {
					this.handleUrl();
				});
			}
		);
		input.value = "";
	}

	renderFriendsList() {
		return this.state.friends.map(friend => {
			if (!friend || this.findConversation(friend._id) !== undefined) return null;
			return (
				<div
					onClick={() => {
						this.props.history.push(`#${friend._id}`);
					}}
					key={friend._id}>
					<div className="img-container">
						<img alt="profile" src={friend.url || DEFAULT_IMG} />
					</div>
					<div className="text-container">
						<span>{friend._id}</span>
						<span>
							<i>Envoyez un message à {friend._id} !</i>
						</span>
					</div>
				</div>
			);
		});
	}

	renderConversation() {
		if (!this.state.new && this.state.conversation === "")
			return (
				<div className="first-conversation">
					<span>Commencez votre première conversation !</span>
				</div>
			);
		if (this.state.new)
			return (
				<div className="first-conversation">
					Envoyez un message à {this.state.new._id} !{this.renderInput()}
				</div>
			);
		return [
			<div key="messages" className="messages">
				{this.state.conversations[this.state.conversation].messages.map(message => {
					return (
						<div
							onLoad={() => console.log("loaded")}
							key={message.time}
							className={message.sender === this.username ? "message me" : "message"}>
							<p>{message.message}</p>
						</div>
					);
				})}
			</div>,
			this.renderInput()
		];
	}

	render() {
		return (
			<div className="container-fluid chat">
				<div className="row">
					<div className="col-3 conversations-list">{this.renderConversationsList()}</div>
					<div className="col-9 conversation">{this.renderConversation()}</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Chat);
