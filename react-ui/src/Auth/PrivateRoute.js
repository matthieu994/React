import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

class PrivateRoute extends Component {
	render() {
		const { component: Component, ...rest } = this.props;
		return (
			<Route
				{...rest}
				render={props => (
					<div>
						{!localStorage.getItem("token") && (
							<Redirect
								to={{ pathname: "/login", state: { from: this.props.location } }}
							/>
						)}
						{localStorage.getItem("token") && <Component {...this.props} />}
					</div>
				)}
			/>
		);
	}
}

export default PrivateRoute;
