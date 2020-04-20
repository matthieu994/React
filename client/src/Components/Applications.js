import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import FlipMove from "react-flip-move";
import "./Applications.css";
import APPS from "./apps.json";
import {
	MDBBtn,
	MDBIcon,
	MDBDropdown,
	MDBDropdownToggle,
	MDBDropdownMenu,
	MDBDropdownItem
} from "mdbreact";
import { Button } from "mdbreact";

class Applications extends Component {
	constructor() {
		super();
		this.state = {
			apps: APPS,
			displaySort: false,
			sortBy: localStorage.getItem("sortBy") || "default"
		};
	}

	renderApplications() {
		let newApps = localStorage.getItem("apps");
		let apps = this.state.apps;
		if (newApps && newApps.length === this.state.apps) apps = newApps.split(",");

		if (this.state.sortBy === "status")
			apps = apps
				.filter(app => app.status === "START")
				.concat(
					apps
						.filter(app => app.status === "DEV")
						.concat(apps.filter(app => app.status === "END"))
				);
		if (this.state.sortBy === "private")
			apps = apps.filter(app => !app.private).concat(apps.filter(app => app.private));

		return apps.map(app => {
			let index = APPS.findIndex(app2 => app2.title === app.title);
			return (
				<Card
					key={index}
					app={app}
					history={this.props.history}
					private={!this.props.isAuth && app.private}
				/>
			);
		});
	}

	reset() {
		localStorage.removeItem("apps");
		this.render();
	}

	toggleSort() {
		this.setState({ displaySort: !this.state.displaySort });
	}

	sort(type) {
		this.setState({ sortBy: type }, () => localStorage.setItem("sortBy", type));
	}

	renderSort() {
		if (!this.state.displaySort) return null;
		return (
			<div className="sort-container">
				<span>Trier par: </span>
				<MDBDropdown>
					<MDBDropdownToggle caret color="primary" size="sm">
						{this.state.sortBy === "default" && "Par défaut"}
						{this.state.sortBy === "status" && "État du projet"}
						{this.state.sortBy === "private" && "Privé"}
					</MDBDropdownToggle>
					<MDBDropdownMenu basic>
						<MDBDropdownItem onClick={() => this.sort("default")}>
							Par défaut
						</MDBDropdownItem>
						<MDBDropdownItem onClick={() => this.sort("status")}>
							État du projet
						</MDBDropdownItem>
						<MDBDropdownItem onClick={() => this.sort("private")}>Privé</MDBDropdownItem>
					</MDBDropdownMenu>
				</MDBDropdown>
			</div>
		);
	}

	render() {
		return (
			<div className="apps-wrapper">
				{/* <i className="fas fa-undo" onClick={() => this.reset()} /> */}
				<MDBBtn className="filter" color="primary" onClick={() => this.toggleSort()}>
					<MDBIcon icon="filter" />
				</MDBBtn>
				{this.renderSort()}
				<FlipMove>{this.renderApplications()}</FlipMove>
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
		// Todo
		return;

		// eslint-disable-next-line
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
		this.oldBounds = {
			left: this.current.offsetLeft,
			top: this.current.offsetTop
		};
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
				) {
					this.current.style.left =
						this.current.style.left.slice(0, -2) - this.state.pos1 + "px";
					this.current.style.top =
						this.current.style.top.slice(0, -2) - this.state.pos2 + "px";
				}
			}
		);
	};

	closeDragElement = () => {
		window.removeEventListener("mousemove", this.elementDrag);
		window.removeEventListener("mouseup", this.closeDragElement);
		this.check();
	};

	check() {
		let current = this.current;
		let swapped = false;
		cards.forEach(card => {
			if (card.getAttribute("index") === this.props.index || swapped) return;
			if (this.isWithin(card)) {
				swapped = true;
				this.swapChild(card);
			}
		});
		if (!swapped) {
			current.style.left = "";
			current.style.top = "";
			this.current.classList.remove("active");
		}
	}

	swapChild(card) {
		this.current.classList.remove("active");
		this.current.style.left = card.offsetLeft - this.oldBounds.left + "px";
		this.current.style.top = card.offsetTop - this.oldBounds.top + "px";

		card.style.left = this.oldBounds.left - card.offsetLeft + "px";
		card.style.top = this.oldBounds.top - card.offsetTop + "px";
		setTimeout(() => {
			card.parentNode.insertBefore(card, this.current);
			this.current.style.left = "";
			this.current.style.top = "";
			card.style.left = "";
			card.style.top = "";
			cards = document.querySelectorAll(".apps-wrapper > .card");
			let apps = [];
			cards.forEach(card => {
				apps.push(card.getAttribute("index"));
			});
			localStorage.setItem("apps", apps);
		}, 300);
	}

	isWithin(card) {
		let currentBounds = this.current.getBoundingClientRect();
		let bounds = card.getBoundingClientRect();
		if (
			currentBounds.x + currentBounds.width < bounds.x + bounds.width &&
			currentBounds.x + currentBounds.width > bounds.x + bounds.width / 2
		)
			return true;
		else return false;
	}

	getStatus() {
		let status;
		if (this.props.app.status === "START") status = "Pas commencé";
		if (this.props.app.status === "DEV") status = "En développement";
		if (this.props.app.status === "END") status = "Terminé";
		return <span>{status}</span>;
	}

	render() {
		return (
			<div className="card" private={this.props.private.toString()}>
				<div className="card-header" onMouseDown={e => this.handleDrag(e)} />
				<div className="card-body">
					<h5 className="card-title">{this.props.app.title + this.props.app.icon}</h5>
					<p className="card-text">{this.props.app.desc}</p>
				</div>
				<div className="card-bottom">
					<Button
						disabled={this.props.private}
						color="primary"
						onClick={() => this.props.history.push(this.props.app.Component)}>
						Y aller !
					</Button>
					{this.getStatus()}
				</div>
			</div>
		);
	}
}

withRouter(Card);

const mapStateToProps = state => {
	return {
		isAuth: state.setAuth.isAuth
	};
};

export default withRouter(connect(mapStateToProps)(Applications));

// (function() {
// 	document.onmousemove = handleMouseMove;
// 	var node = document.createElement("span");
// 	document.querySelector("body").appendChild(node);
// 	function handleMouseMove(event) {
// 		node.innerText = `${event.x}, ${event.y}`;
// 	}
// })();
