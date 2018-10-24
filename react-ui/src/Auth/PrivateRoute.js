import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { toggleLoginModal } from "../redux/actions/index";

class PrivateRoute extends Component {
	componentWillMount() {
		if (!this.props.modal && !localStorage.getItem("token"))
			this.props.toggleLoginModal();
	}
	render() {
		const { component: Component, ...rest } = this.props;
		return (
			<Route
				{...rest}
				render={props => (
					<div>
						{!localStorage.getItem("token") && (
							<Redirect to={{ pathname: "/", state: { from: this.props.location } }} />
						)}
						{localStorage.getItem("token") && <Component {...this.props} />}
					</div>
				)}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		modal: state.loginModal
	};
};
const mapDispatchToProps = dispatch => {
	return {
		toggleLoginModal: () => dispatch(toggleLoginModal())
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PrivateRoute);
