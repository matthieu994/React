import React, { Component } from "react";
import axios from "axios";
import io from "socket.io-client";

export default class Chat extends Component {
	state = {
		conversation: "",
		friends: []
	};

	componentDidMount() {
		axios.defaults.headers.common["token"] = localStorage.getItem("token");
		this.socket = io("/Chat");

		this.socket.on("connect", () => {
			this.getMessages();
		});
	}

	componentWillUnmount() {
		this.socket.disconnect();
	}

	getMessages() {
		axios
			.post("/chat", {
				socket: this.socket.id
			})
			.then(data => {
				this.setState({ friends: data.data.friends });
			});
	}

	createConversation(e) {
		e.preventDefault();
	}

	render() {
		let friends = this.state.friends.map(friend => {
			if (friend.status !== "OK") return null;
			return (
				<div key={friend._id}>
					<span>{friend._id}</span>
				</div>
			);
		});

		return (
			<div className="container">
				<div className="row">
					<div className="col">
						<h1>Chat</h1>
						<div className="col">
							<form className="form-inline d-inline-block">
								<div className="form-group">
									<button
										className="btn btn-outline-primary ml-2 "
										onClick={e => this.createConversation(e)}>
										Créer conversation
									</button>
									{friends}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
