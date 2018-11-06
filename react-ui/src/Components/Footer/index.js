import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import NightShift from "../NightShift"
import apps from "../apps.json";
import "./footer.scss";

class Footer extends Component {
	render() {
		return (
			<footer>
				<NightShift />
				<div className="container-fluid text-center">
					<div className="row">
						<h3 className="col font-weight-bold">Applications</h3>
					</div>
					<div className="row">
						{apps.map((app, index) => (
							<div className="col" key={index}>
								<Link to={app.Component}>{app.title}</Link>
							</div>
						))}
					</div>
				</div>
			</footer>
		);
	}
}
export default withRouter(Footer);
