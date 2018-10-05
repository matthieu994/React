import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import "./Chat.css";

class Chat extends Component {
	state = {
		conversations: "",
		friends: [],
		friend: ""
	};

	componentDidMount() {
		axios.defaults.headers.common["token"] = localStorage.getItem("token");
		this.socket = io("/Chat");

		window.addEventListener("resize", this.updateDimensions);
		window.addEventListener("hashchange", this.handleUrl);

		this.socket.on("connect", () => {
			this.getData().then(() => {
				this.handleUrl();
				this.updateDimensions();
			});
		});
	}

	componentWillUnmount() {
		this.socket.disconnect();
		window.removeEventListener("resize", this.updateDimensions);
		window.removeEventListener("hashchange", this.handleUrl);
	}

	updateDimensions() {
		document.querySelector(".chat .row > div").style.height =
			window.innerHeight - document.querySelector("header").clientHeight + "px";
	}

	handleUrl() {
		if (!this.state.friends || !window.location.hash) return;
		let username = window.location.hash.substr(1);
		let friend = this.state.friends.find(friend => friend._id === username);
		if (friend) {
			this.setState({
				friend: friend
			});
		} else {
			this.setState({
				friend: ""
			});
			this.props.history.push(`#`);
		}
	}

	async getData() {
		axios
			.post("/chat", {
				socket: this.socket.id
			})
			.then(data => {
				this.setState({
					friends: data.data.friends,
					conversations: data.data.conversations
				});
			});
	}

	renderConversationsList() {
		if (this.state.conversations.length === 0) return this.renderFriendsList();
		return this.state.conversations.map(conversation => {
			if (!conversation) return null;
			return (
				<div key={conversation._id}>
					<div className="img-container">
						<img alt="conversation" src={conversation.url} />
					</div>
					<div className="text-container">
						<span
							onClick={() => {
								this.props.history.push(`#${conversation._id}`);
								this.handleUrl();
							}}>
							{conversation._id}
						</span>
						<span>Last message</span>
					</div>
				</div>
			);
		});
	}

	renderFriendsList() {
		return this.state.friends.map(friend => {
			if (!friend) return null;
			return (
				<div key={friend._id}>
					<div className="img-container">
						<img alt="profile" src={friend.url} />
					</div>
					<div className="text-container">
						<span
							onClick={() => {
								this.props.history.push(`#${friend._id}`);
								this.handleUrl();
							}}>
							{friend._id}
						</span>
						<span>
							<i>Envoyez le premier message !</i>
						</span>
					</div>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="container-fluid chat">
				<div className="row">
					<div className="col-3 friends-list">{this.renderConversationsList()}</div>
					<div className="col-9 conversation" />
				</div>
			</div>
		);
	}
}

export default withRouter(Chat);
