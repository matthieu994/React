import React, { Component } from "react";
import { render } from "react-dom";
//eslint-disable-next-line
import index from "./redux/index";
import store from "./redux/store/index";
import { Provider } from "react-redux";
import Routes from "./Routes";
import Footer from "./Components/Footer";
import Links from "./Components/Links";
import { BrowserRouter as Router } from "react-router-dom";

class Root extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div>
						<Links />
						<Routes />
						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

render(<Root />, document.getElementById("root"));
