import React, { Component } from "react";
import "./Modal.css";
import { Route } from "react-router-dom";
// import Login from "../../Auth/Login";

export default class Modal extends Component {
	render() {
		if (!this.props.display) return null;

		const { component: Component, ...rest } = this.props;
		return (
			<div className="modal-container">
				<div className="modal-dialog">
					<Route {...rest} render={props => <Component {...this.props} />} />
				</div>
			</div>
		);
	}
}
