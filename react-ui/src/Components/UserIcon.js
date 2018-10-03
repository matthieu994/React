import React, { Component } from "react";
import verifAuth from "../Auth/verifAuth";
import { withRouter } from "react-router-dom";

class UserIcon extends Component {
	state = {
		isAuth: false,
		isMounted: false
	};

	componentDidMount() {
		this.isAuth();

		this.unlisten = this.props.history.listen(() => {
			this.isAuth();
		});
	}

	isAuth() {
		verifAuth().then(isAuth => {
			this.setState({
				isMounted: true,
				isAuth
			});
		});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	logout() {
		localStorage.clear("token");
		this.setState({
			isAuth: false
		});
		this.props.history.push("/login");
	}

	redirectProfile() {
		this.props.history.push("/Profile");
	}

	render() {
		if (!this.state.isMounted || !this.state.isAuth) return null;

		return (
			<div className="user">
				{this.props.location.pathname !== "/Profile" && (
					<i className="fas fa-user-circle" onClick={this.redirectProfile.bind(this)} />
				)}
				<span onClick={this.logout.bind(this)}>Log-Out</span>
			</div>
		);
	}
}
export default withRouter(UserIcon);
