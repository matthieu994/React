import React, { Component } from "react";
import studies from "./studies.json";
import "./Timeline.css";

export default class Timeline extends Component {
	renderStudies() {
		return studies.map(study => {
			return (
				<div className="timeline-item" key={study.name}>
					<div className="timeline-icon">
						<span>{study.to ? study.to : "___"}</span>
						<span>-</span>
						<span>{study.from}</span>
					</div>
					<div className="timeline-content">
						<h2>{study.name}</h2>
						<p>
							<i>{study.place}</i>
						</p>
						<p>{study.desc}</p>
						{/* <a href="#" className="btn">
								button
							</a> */}
					</div>
				</div>
			);
		});
	}

	componentDidMount() {
		let items = document.querySelectorAll("div[content='studies'] .timeline-item");
		let index = 0;
		this.animNext(items, index);
	}

	animNext(items, index) {
		setTimeout(() => {
			let direction = index % 2 === 0 ? "right" : "left";
			items[index].style.animation = "slidefrom" + direction + " 1s ease-out both";
			setTimeout(
				function() {
					this.style.animation = "zoomin 1s ease-out both";
				}.bind(items[index].children[0]),
				600
			);
			if (++index < items.length) this.animNext(items, index);
		}, 400);
	}

	render() {
		return (
			<div className="container" content={"studies"}>
				<div id="timeline">{this.renderStudies()}</div>
			</div>
		);
	}
}

// https://codepen.io/itbruno/pen/KwarLp
