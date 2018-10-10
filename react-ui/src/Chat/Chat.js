import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import io from "socket.io-client";
import { DEFAULT_IMG } from "../Const/const";
import "./Chat.css";
import "emoji-mart/css/emoji-mart.css";
import { Picker, Emoji } from "emoji-mart";

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
		if (!this.state.friends) return;

		if (!window.location.hash) {
			return this.setState({ new: "", conversation: "" });
		}

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
				let users = conversation.users.filter(user => user !== this.username); //liste users in conv
				return (
					<div
						key={index}
						onClick={() => {
							!users.find(user => window.location.hash.substr(1) === user) &&
								this.props.history.push(
									`#${this.state.friends.find(user => user._id === users[0])._id}`
								);
						}}>
						<div className="img-container">
							<img
								alt="conversation"
								src={
									this.state.friends.find(user => user._id === users[0]).url ||
									DEFAULT_IMG
								}
							/>
						</div>
						<div className="text-container">
							<span>{this.state.friends.find(user => user._id === users[0])._id}</span>
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
				<div className="form-buttons">
					<Emojis />
					<button className="btn btn-info send" onClick={e => this.sendMessage(e)}>
						Envoyer
					</button>
				</div>
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
						window.location.hash.substr(1) !== friend._id &&
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
		if (
			!window.location.hash &&
			this.state.friends.length > 0 &&
			this.state.conversations.length > 0
		) {
			this.props.history.push(`#${this.state.friends[0]._id}`);
		}
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

class Emojis extends Component {
	componentDidMount() {
		this.updateDimensions();
		window.addEventListener("resize", this.updateDimensions);
	}

	updateDimensions() {
		let parent = document.querySelector(".emojis");
		let overlay = document.querySelector(".emojis .overlay");
		overlay.style.top = totalOffset(parent).top - overlay.offsetHeight - 7 + "px";
		overlay.style.left = totalOffset(parent).left - overlay.offsetWidth/2 + "px";
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	renderEmojis() {
		return (
			<Picker
				set="messenger"
				title="Choisissez…"
				emoji="point_up"
				color="#17a2b8"
				notFoundEmoji="see_no_evil"
				onClick={this.insertEmoji}
				i18n={{
					search: "Recherche",
					notfound: "Aucun emoji trouvé",
					categories: { search: "Résultats de la recherche", recent: "Récents" }
				}}
			/>
		);
	}

	insertEmoji(data) {
		let el = document.querySelector(".text-input textarea");
		el.value =
			el.value.substr(0, el.selectionStart) +
			data.native +
			el.value.substr(el.selectionStart);
	}

	toggle() {
		this.updateDimensions();
		document.querySelector(".emojis .overlay").style.visibility =
			document.querySelector(".emojis .overlay").style.visibility === "visible"
				? "hidden"
				: "visible";
	}

	render() {
		return (
			<div className="emojis">
				<div className="button">
					<Emoji
						emoji="grinning"
						set="messenger"
						size={32}
						onClick={() => this.toggle()}
					/>
				</div>
				<div className="overlay">{this.renderEmojis()}</div>
			</div>
		);
	}
}

var totalOffset = function(element) {
	var top = 0,
		left = 0;
	do {
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while (element);

	return {
		top: top,
		left: left
	};
};

// eslint-disable-next-line
var replaceEmoji = function(string) {
	let regex = new RegExp("(^|\\s)(:[a-zA-Z0-9-_+]+:(:skin-tone-[2-6]:)?)", "g");
	let match;
	while ((match = regex.exec(string))) {
		let colons = match[2];
		let offset = match.index + match[1].length;
		let length = colons.length;

		console.log(colons, offset, length);
	}
};
