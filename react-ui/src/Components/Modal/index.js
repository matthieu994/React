import React, { Component } from "react";
import "./Modal.css";
import Login from "../../Auth/Login";

export default class Modal extends Component {
	constructor(props) {
		super();
	}

	render() {
		if (!this.props.display) return null;
		return (
			<div className="modal-container">
				<div className="modal-dialog">
					<Login />
				</div>
			</div>
		);
	}
}
