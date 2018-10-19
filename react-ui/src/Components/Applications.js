import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Applications.css";
import apps from "./apps.json";

export class Applications extends Component {
	constructor() {
		super();
		this.state = {
			apps
		};
	}

	handleDrag(e) {
		e.preventDefault();
	}

	renderApplications() {
		return this.state.apps.map((app, index) => {
			return <Card key={index} index={index} app={app} />;
		});
	}

	render() {
		return (
			<div>
				<div className="apps-wrapper">{this.renderApplications()}</div>
			</div>
		);
	}
}

class Card extends Component {
	constructor() {
		super();
		this.state = {
			pos1: 0,
			pos2: 0,
			pos3: 0,
			pos4: 0
		};
	}

	handleDrag(e) {
		cards = document.querySelectorAll(".apps-wrapper > .card");

		e = e || window.event;
		e.preventDefault();
		this.setState({
			pos3: e.clientX,
			pos4: e.clientY
		});
		window.addEventListener("mousemove", this.elementDrag);
		window.addEventListener("mouseup", this.closeDragElement);
	}

	elementDrag = e => {
		e = e || window.event;
		e.preventDefault();
		this.setState(
			prevState => ({
				pos1: prevState.pos3 - e.clientX,
				pos2: prevState.pos4 - e.clientY,
				pos3: e.clientX,
				pos4: e.clientY
			}),
			() => {
                console.log(cards[this.props.index].getBoundingClientRect())
				if (cards[this.props.index].getBoundingClientRect().x - this.state.pos1 > 0 && cards[this.props.index].getBoundingClientRect().x- this.state.pos1 + cards[this.props.index].getBoundingClientRect().width < window.innerWidth)
					cards[this.props.index].style.left =
						cards[this.props.index].style.left.slice(0, -2) - this.state.pos1 + "px";
				// cards[this.props.index].style.top =
				// cards[this.props.index].style.top.slice(0, -2) - this.state.pos2 + "px";
			}
		);
	};

	closeDragElement = () => {
		window.removeEventListener("mousemove", this.elementDrag);
		window.removeEventListener("mouseup", this.closeDragElement);
	};

	render() {
		return (
			<div className="card" onMouseDown={e => this.handleDrag(e)} key={this.props.index}>
				<div className="card-body">
					<h5 className="card-title">{this.props.app.title}</h5>
					<p className="card-text">{this.props.app.desc}</p>
				</div>
				<div className="card-bottom">
					<Link className="btn btn-primary" to={this.props.app.Component}>
						Y aller !
					</Link>
				</div>
			</div>
		);
	}
}

let cards = [];
