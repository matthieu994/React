import React, { Component } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { displayLoginModal } from "../redux/actions/index";
import verifAuth from "../Auth/verifAuth";

class PrivateRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAuth: false,
			isMounted: false
		};
	}

	componentDidMount() {
		verifAuth().then(isAuth => {
			this.setState({
				isMounted: true,
				isAuth
			});
			if (!isAuth) {
				this.props.history.push("/login");
				this.props.displayLoginModal();
			}
		});
	}

	render() {
		if (!this.state.isMounted) return null;
		const { component: Component, ...rest } = this.props;
		return (
			<Route
				{...rest}
				render={props => (
					<div>
						{!this.state.isAuth && (
							<Redirect to={{ pathname: "/", state: { from: this.props.location } }} />
						)}
						{this.state.isAuth && <Component {...this.props} />}
					</div>
				)}
			/>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		displayLoginModal: () => dispatch(displayLoginModal())
	};
};

export default withRouter(
	connect(
		null,
		mapDispatchToProps
	)(PrivateRoute)
);
