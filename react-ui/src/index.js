import React, { Component } from "react";
import { render } from "react-dom";
//eslint-disable-next-line
import index from "./redux/index";
import Routes from "./Routes";
import Footer from "./Components/Footer";
import Links from "./Components/Links";
import { BrowserRouter as Router } from "react-router-dom";

class Root extends Component {
	render() {
		return (
			<Router>
				<div>
					<Links />
					<Routes />
					<Footer />
				</div>
			</Router>
		);
	}
}

render(<Root />, document.getElementById("root"));
