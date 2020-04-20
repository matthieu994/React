import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Picker, Emoji, emojiIndex } from "emoji-mart";
import Axios from "axios";
import io from "socket.io-client";
import { DEFAULT_IMG } from "../Const/const";
import "./Chat.css";
import "emoji-mart/css/emoji-mart.css";
import Dropdown from "./Dropdown";

let currentUsername;
class Chat extends Component {
	constructor() {
		super();
		this.state = {
			conversations: [],
			conversation: "",
			friends: [],
			new: "",
			mounted: false
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
				this.setState({ mounted: true });
			});
		});

		this.socket.on("createConversation", conv => {
			this.setState(
				{
					conversations: [...this.state.conversations, conv]
				},
				() => {
					this.handleUrl();
				}
			);
		});

		this.socket.on("newMessage", data => {
			let conversations = this.state.conversations;
			conversations.find(convo => convo._id === data.id).messages.push(data.message);
			this.setState(
				{
					conversations: this.sortConvs(this.state.conversations)
				},
				() => {
					this.handleUrl();
					this.scrollBottom();
				}
			);
		});

		this.socket.on("deleteConversation", id => {
			if (
				this.state.conversation >= 0 &&
				this.state.conversations[this.state.conversation] &&
				this.state.conversations[this.state.conversation]._id === id
			) {
				if (this.state.conversations[this.state.conversation].users.length === 2) {
					let friend = this.state.conversations[this.state.conversation].users.find(
						user => user !== currentUsername
					);
					this.setState({
						new: this.state.friends.find(fr => fr._id === friend)
					});
				} else {
					this.props.history.push(`#`);
				}
				this.setState({ conversation: "" });
			}
			let convs = this.state.conversations;
			convs.splice(convs.indexOf(convs.find(conv => conv._id === id)), 1);
			this.setState({ conversations: convs });
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

	updateDimensions = () => {
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
	};

	scrollBottom() {
		let el = document.querySelector(".messages");
		if (!el) return;
		el.scrollTop = el.scrollHeight;
		el.addEventListener("scroll", () => {
			document.querySelector(".messages > .time").style.visibility = "hidden";
		});
	}

	findConversation(name) {
		if (this.state.conversations.length < 1) return;
		let convo;
		this.state.conversations.forEach((conversation, index) => {
			conversation.users.forEach(user => {
				if (user === name && user !== currentUsername) convo = index;
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
			this.setSelected(conversation);
		} else if (conversation === undefined) {
			let friend = this.state.friends.find(friend => friend._id === hash);
			if (!friend) {
				this.props.history.push(`#`);
			} else if (friend !== this.state.new) {
				this.setState({
					new: friend,
					conversation: ""
				});
				// this.renderConversation();
			}
		}
	}

	async getData() {
		return await Axios.get("/Chat/data", {
			params: {
				socket: this.socket.id
			}
		}).then(data => {
			currentUsername = data.data.username;
			this.sortConvs(data.data.conversations);
			this.setState({
				friends: data.data.friends,
				conversations: data.data.conversations
			});
		});
	}

	sortConvs(arr) {
		return arr.sort(
			(a, b) =>
				Date.parse(b.messages[b.messages.length - 1].time) -
				Date.parse(a.messages[a.messages.length - 1].time)
		);
	}

	onConversationClick(e, users) {
		this.setSelected(e);
		!e.target.className.includes("fas") &&
			!users.find(user => window.location.hash.substr(1) === user) &&
			this.props.history.push(
				`#${this.state.friends.find(user => user._id === users[0])._id}`
			);
	}

	setSelected(e) {
		document
			.querySelectorAll(".conversations-list > div")
			.forEach(el => el.removeAttribute("selected"));
		if (!isNaN(e)) {
			document
				.querySelectorAll(".conversations-list > div")
				// eslint-disable-next-line
				[e].setAttribute("selected", "");
		} else e.target.closest(".conversations-list > div").setAttribute("selected", "");
	}

	renderConversationsList() {
		if (this.state.conversations.length === 0) return this.renderFriendsList();
		return [
			this.state.conversations.map((conversation, index) => {
				if (!conversation) return null;
				let users = conversation.users.filter(user => user !== currentUsername); //liste users in conv
				return (
					<div key={index} onClick={e => this.onConversationClick(e, users)}>
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
							<Dropdown socket={this.socket} id={conversation._id} />
							<div className="text-preview">
								<span>
									{conversation.messages[conversation.messages.length - 1].message}
								</span>
							</div>
						</div>
					</div>
				);
			}),
			this.renderFriendsList()
		];
	}

	handleKey(e) {
		let el = document.querySelector(".input-container textarea");
		let emoji = replaceEmoji(document.querySelector(".input-container textarea").value);

		if (emoji) {
			let selStart = el.selectionStart;
			let prev = document.querySelector(".input-container textarea").value.length;
			document.querySelector(".input-container textarea").value = emoji;
			let newSel = emoji.length - prev;
			el.setSelectionRange(selStart + newSel, selStart + newSel);
		}

		if (e.keyCode === 13) {
			if (e.ctrlKey || e.shiftKey) {
				e.preventDefault();
				el.value =
					el.value.substr(0, el.selectionStart) +
					"\n" +
					el.value.substr(el.selectionStart);
			} else {
				this.sendMessage(e);
			}
		}
		document.querySelector(".emojis .overlay").style.visibility = "hidden";
	}

	renderInput() {
		return (
			<div key="form" className="input-container">
				<FavEmojis />
				<div className="input-buttons-container">
					<textarea type="text" onKeyDown={e => this.handleKey(e)} />
					<div className="form-buttons">
						<Emojis />
						<button className="btn btn-info send" onClick={e => this.sendMessage(e)}>
							Envoyer
						</button>
					</div>
				</div>
			</div>
		);
	}

	sendMessage(e) {
		e.preventDefault();
		let input = document.querySelector(".input-container textarea");
		if (input.value.trim() === "") return;
		if (this.state.new) return this.createConversation(input);
		this.socket.emit("sendMessage", {
			conversation: this.state.conversations[this.state.conversation]._id,
			message: input.value.trim(),
			sender: currentUsername
		});
		input.value = "";
		document.querySelector(".emojis .overlay").style.visibility = "hidden";
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
		document.querySelector(".input-container textarea").focus();
	}

	renderFriendsList() {
		return this.state.friends.map(friend => {
			if (!friend || this.findConversation(friend._id) !== undefined) return null;
			return (
				<div
					onClick={e => {
						this.setSelected(e);
						window.location.hash.substr(1) !== friend._id &&
							this.props.history.push(`#${friend._id}`);
					}}
					onLoad={e =>
						window.location.hash.substr(1) === friend._id && this.setSelected(e)
					}
					key={friend._id}>
					<div className="img-container">
						<img alt="profile" src={friend.url || DEFAULT_IMG} />
					</div>
					<div className="text-container">
						<span>{friend._id}</span>
						<div className="text-preview">
							<span>
								<i>Envoyez un message à {friend._id} !</i>
							</span>
						</div>
					</div>
				</div>
			);
		});
	}

	renderConversation() {
		if (!this.state.mounted) return;
		// Si pas de hash et conv>=1
		if (!window.location.hash) {
			if (this.state.conversations.length > 0) {
				// return this.props.history.push(`#${this.state.conversation._id}`);
			}
		}
		// Si pas de new conv et pas de conv active
		if (!this.state.new && this.state.conversation === "")
			return (
				<div className="first-conversation">
					<span>Commencez votre première conversation !</span>
				</div>
			);
		if (this.state.new)
			return [
				<div key="friend-conv" className="first-conversation">
					Envoyez un message à {this.state.new._id} !
					<Emoji emoji="wave" set="messenger" size={32} />
				</div>,
				this.renderInput()
			];
		return [
			<div key="messages" className="messages">
				{this.state.conversations[this.state.conversation].messages.map(message => {
					return <Message key={message.time} message={message} />;
				})}
				<span className="time" />
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

class Message extends Component {
	constructor(props) {
		super(props);
		this.message = React.createRef();
		this.time = new Date(Date.parse(this.props.message.time));
	}

	showTime() {
		let time = document.querySelector(".messages > .time");
		time.style.visibility = "visible";
		time.innerHTML = `${this.time.getHours()}:${this.time.getMinutes()}`;
		if (this.message.current.parentElement.classList.contains("me")) {
			time.style.left =
				this.message.current.getBoundingClientRect().left - time.offsetWidth - 5 + "px";
		} else {
			time.style.left =
				this.message.current.getBoundingClientRect().left +
				5 +
				this.message.current.offsetWidth +
				"px";
		}
		time.style.top =
			this.message.current.getBoundingClientRect().top +
			this.message.current.offsetHeight / 2 -
			time.offsetHeight / 2 +
			"px";
	}

	hideTime() {
		document.querySelector(".messages > .time").style.visibility = "hidden";
	}

	render() {
		return (
			<div
				className={
					this.props.message.sender === currentUsername ? "message me" : "message"
				}>
				<p
					ref={this.message}
					onMouseEnter={() => this.showTime()}
					onMouseLeave={() => {
						this.hideTime();
					}}>
					{this.props.message.message}
				</p>
			</div>
		);
	}
}

class Emojis extends Component {
	componentDidMount() {
		this.updateDimensions();
		window.addEventListener("click", this.closeMenu);
		window.addEventListener("resize", this.updateDimensions);
	}

	updateDimensions = () => {
		let parent = document.querySelector(".emojis");
		let overlay = document.querySelector(".emojis .overlay");
		overlay.style.top = totalOffset(parent).top - overlay.offsetHeight - 7 + "px";
		overlay.style.left = totalOffset(parent).left - overlay.offsetWidth / 2 + "px";
	};

	componentWillUnmount() {
		window.removeEventListener("click", this.closeMenu);
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
		let el = document.querySelector(".input-container textarea");
		el.value =
			el.value.substr(0, el.selectionStart) +
			data.native +
			el.value.substr(el.selectionStart);
		el.focus();
	}

	closeMenu = e => {
		e.preventDefault();
		e.stopPropagation();
		if (
			(document.querySelector(".emojis .overlay").style.visibility = "visible") &&
			!document.querySelector(".emojis .overlay").contains(e.target)
		)
			document.querySelector(".emojis .overlay").style.visibility = "hidden";
	};

	toggle(e) {
		e.preventDefault();
		e.stopPropagation();
		this.updateDimensions();
		document.querySelector(".emojis .overlay").style.visibility =
			document.querySelector(".emojis .overlay").style.visibility === "visible"
				? "hidden"
				: "visible";
	}

	render() {
		return (
			<div className="emojis">
				<div className="button" onClick={e => this.toggle(e)}>
					<Emoji emoji="grinning" set="messenger" size={32} />
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
	let hasEmoji = false;
	while ((match = regex.exec(string))) {
		let colons = match[2];

		// console.log(emojiIndex.search(colons.slice(1, -1))[0]);
		if (emojiIndex.search(colons.slice(1, -1)).length > 0) {
			hasEmoji = true;
			string = string.replace(
				":" + colons.slice(1, -1) + ":",
				emojiIndex.search(colons.slice(1, -1))[0].native
			);
		}
	}
	if (!hasEmoji) return hasEmoji;
	return string;
};

class FavEmojis extends Component {
	constructor() {
		super();
		this.state = {
			emojis: [],
			favs: []
		};
	}
	componentDidMount() {
		this.getFavs();
		window.addEventListener("resize", this.updateDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	updateDimensions = () => {
		if (!this.state.emojis) return;
		let bar = document.querySelector(".input-container .fav-emojis");
		let parent = document.querySelector(".input-container");
		let width = parent.offsetWidth / 3;
		let favsCount = Math.floor(width / (32 + 11));
		this.setState(
			{
				favs: this.state.emojis.slice(0, favsCount)
			},
			() => {
				bar.style.width = this.state.favs.length * (32 + 13) + "px";
				if (this.state.favs.length === 0) bar.style.visibility = "hidden";
				else bar.style.visibility = "";
			}
		);
		bar.style.top = totalOffset(parent).top - bar.offsetHeight + "px";
		bar.style.left = totalOffset(parent).left + parent.offsetWidth / 3 + "px";
	};

	getFavs() {
		let favs = JSON.parse(localStorage.getItem("emoji-mart.frequently"));
		var map = new Map();
		let arr = [];
		for (var k in favs) {
			map.set(k, favs[k]);
		}
		map[Symbol.iterator] = function*() {
			yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
		};
		let i = 0;
		for (let [key] of map) {
			arr[i] = key;
			i++;
		}
		this.setState({ emojis: arr }, this.updateDimensions);
		this.updateDimensions();
	}

	insertEmoji(data) {
		let el = document.querySelector(".input-container textarea");
		el.value =
			el.value.substr(0, el.selectionStart) +
			data.native +
			el.value.substr(el.selectionStart);
		el.focus();
	}

	renderEmojis() {
		if (this.state.emojis.length < 1) return;

		return this.state.favs.map(emoji => {
			return (
				<Emoji
					key={emoji}
					emoji={emoji}
					set="messenger"
					size={32}
					onClick={this.insertEmoji}
				/>
			);
		});
	}

	render() {
		return <div className="fav-emojis">{this.renderEmojis()}</div>;
	}
}
