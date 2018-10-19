import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Applications.css";
import apps from "./apps.json";
import { Swappable } from "@shopify/draggable";

export class Applications extends Component {
	constructor() {
		super();
		this.state = {
			apps
		};
	}

	componentDidMount() {
		const swappable = new Swappable(document.querySelectorAll(".apps-wrapper"), {
			draggable: ".card"
        });
        swappable.on('swappable:swap', () => console.log('swappable:swap'));
	}

	renderApplications() {
		return this.state.apps.map((app, index) => {
			return (
				<div className="card" key={index}>
					<div className="card-body">
						<h5 className="card-title">{app.title}</h5>
						<p className="card-text">{app.desc}</p>
					</div>
					<div className="card-bottom">
						<Link className="btn btn-primary" to={app.Component}>
							Y aller !
						</Link>
					</div>
				</div>
			);
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
