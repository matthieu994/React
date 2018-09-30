import React, { Component } from "react";
import axios from "axios";

export default class Chat extends Component {
	constructor() {
		super();
		axios.defaults.headers.common["token"] = localStorage.getItem("token");
	}

	componentDidMount() {
		this.getMessages();
	}

	getMessages() {
		axios.post("/chat").then(data => {
			console.log(data);
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
