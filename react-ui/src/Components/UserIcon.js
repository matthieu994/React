import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class UserIcon extends Component {
	state = {
		isAuth: true,
		isMounted: true
	};

	logout() {
		localStorage.clear("token");
		this.setState({
			isAuth: false
		});
		this.props.history.push("/");
	}

	redirectProfile() {
		this.props.history.push("/Profile");
	}

	render() {
		if (!this.state.isMounted) return null;
		if (!this.state.isAuth || !localStorage.getItem("token")) return null;

		return (
			<div className="user">
				{this.props.location.pathname !== "/Profile" && (
					<i className="fas fa-user-circle" onClick={this.redirectProfile.bind(this)} />
				)}
				<a className="btn btn-info" onClick={this.logout.bind(this)}>
					Log Out
				</a>
			</div>
		);
	}
}
export default withRouter(UserIcon);
