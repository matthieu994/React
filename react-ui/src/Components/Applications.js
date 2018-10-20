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

let cards = [];

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
		this.current = document.querySelector(
			`.apps-wrapper > .card[index="${this.props.index}"]`
		);
		this.current.classList.add("active");
		this.oldBounds = this.current.getBoundingClientRect();
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
				// console.log(this.current.getBoundingClientRect());
				if (
					this.current.getBoundingClientRect().x - this.state.pos1 > 20 &&
					this.current.getBoundingClientRect().x -
						this.state.pos1 +
						this.current.getBoundingClientRect().width <
						window.innerWidth - 20
				)
					this.current.style.left =
						this.current.style.left.slice(0, -2) - this.state.pos1 + "px";
				this.current.style.top =
					this.current.style.top.slice(0, -2) - this.state.pos2 + "px";
			}
		);
	};

	closeDragElement = () => {
		window.removeEventListener("mousemove", this.elementDrag);
		window.removeEventListener("mouseup", this.closeDragElement);
		this.checkSize();
	};

	checkSize() {
		let current = this.current;
		let currentBounds = this.current.getBoundingClientRect();
		let swapped;
		cards.forEach(card => {
			if (card.getAttribute("index") === this.props.index || swapped) return;
			let bounds = card.getBoundingClientRect();
			if (
				currentBounds.x + currentBounds.width < bounds.x + bounds.width &&
				currentBounds.x + currentBounds.width > bounds.x + bounds.width / 2
			) {
				swapped = true;
				this.swapChild(card.getAttribute("index"));
			}
		});
		current.style.left = "";
		current.style.top = "";
		this.current.classList.remove("active");
	}

	swapChild(index) {
		cards[index].parentNode.insertBefore(cards[index], this.current);
		cards = document.querySelectorAll(".apps-wrapper > .card");
	}

	render() {
		return (
			<div className="card" key={this.props.index} index={this.props.index}>
				<div className="card-header" onMouseDown={e => this.handleDrag(e)} />
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
