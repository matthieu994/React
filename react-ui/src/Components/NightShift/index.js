import React, { Component } from "react";
import { Button, Fa } from "mdbreact";
import "./index.scss";

export default class NightShift extends Component {
	state = {
		on: localStorage.getItem("nightshift")
	};

	toggle() {
		this.setState({ on: !this.display() }, () => {
			localStorage.setItem("nightshift", this.state.on);
		});
	}

	display() {
		if (this.state.on === true || this.state.on === "true") return true;
		else return false;
	}

	render() {
		return (
			<>
				{this.display() && <div className="nightshift" />}
				<Button
					className="nightshift"
					color={this.display() ? "indigo" : ""}
					onClick={() => this.toggle()}>
					<Fa icon="moon" />
				</Button>
			</>
		);
	}
}
