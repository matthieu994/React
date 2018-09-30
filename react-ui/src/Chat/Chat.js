import React, { Component } from "react";
import axios from "axios";
import io from "socket.io-client";

export default class Chat extends Component {
	constructor() {
		super();
		this.socket = io("/Chat");
		axios.defaults.headers.common["token"] = localStorage.getItem("token");
	}

	componentDidMount() {
		this.getMessages();
	}

	componentWillUnmount() {
		this.socket.disconnect();
	}

	getMessages() {
		axios.get("/chat").then(data => {
			console.log(data.data);
		});
	}

	render() {
		return (
			<div className="container live">
				<div className="row">
					<div className="col">
						<h1>Chat</h1>
					</div>
				</div>
			</div>
		);
	}
}
