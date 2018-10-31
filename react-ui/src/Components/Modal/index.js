import React, { Component } from "react";
import "./Modal.css";
import { Route } from "react-router-dom";

export default class Modal extends Component {
	constructor(props) {
		super(props);
		this.ref = React.createRef();
	}

	componentWillReceiveProps(props) {
		if (!props.display) {
			this.ref.current.setAttribute("off", "");
		} else {
			this.ref.current.removeAttribute("off");
		}
	}

	render() {
		const { component: Component, ...rest } = this.props;
		return (
			<div ref={this.ref} className="modal-container">
				<div className="modal-dialog">
					<Route {...rest} render={props => <Component {...this.props} />} />
				</div>
			</div>
		);
	}
}
