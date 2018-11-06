import React, { Component } from "react";
import "./Modal.css";
import { Route } from "react-router-dom";

export default class Modal extends Component {
	constructor(props) {
		super(props);
		this.ref = React.createRef();
		window.addEventListener("resize", this.handleSize);
	}

	componentWillReceiveProps(props) {
		if (!props.display) {
			this.ref.current.setAttribute("off", "");
			window.removeEventListener("resize", this.handleSize);
		} else {
			this.ref.current.removeAttribute("off");
			this.handleSize();
		}
	}

	handleSize = () => {
		if (!this.ref.current) return;
		this.ref.current.style.marginTop = document.querySelector("header").clientHeight + "px";
	};

	close(e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.target !== this.ref.current) return;
		if (this.props.onClose) this.props.onClose();
	}

	render() {
		const { component: Component, ...rest } = this.props;
		return (
			<div
				ref={this.ref}
				className="modal-container"
				off="true"
				onClick={e => this.close(e)}>
				<div className="dialog">
					{this.props.display && (
						<Route {...rest} render={props => <Component {...this.props} />} />
					)}
				</div>
			</div>
		);
	}
}
