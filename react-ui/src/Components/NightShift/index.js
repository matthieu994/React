import React, { Component } from "react";
import { Button, Fa } from "mdbreact";
import "./index.scss";

export default class NightShift extends Component {
	state = {
		on: localStorage.getItem("nightshift")
	};

	componentDidMount() {
		this.display();
	}

	toggle() {
		this.setState({ on: !this.isOn() }, () => {
			localStorage.setItem("nightshift", this.state.on);
			this.display();
		});
	}

	isOn() {
		if (this.state.on === true || this.state.on === "true") return true;
		else return false;
	}

	display() {
		let div = document.querySelector("div.nightshift");
		if (!this.isOn() && div) {
			console.log("here");
			document.body.removeChild(div);
		} else if (this.isOn()) {
			console.log("here2");
			div = document.createElement("div");
			div.className = "nightshift";
			document.body.prepend(div);
		}
	}

	render() {
		return (
			<Button
				className="nightshift"
				color={this.isOn() ? "indigo" : ""}
				onClick={() => this.toggle()}>
				<Fa icon="moon" />
			</Button>
		);
	}
}
