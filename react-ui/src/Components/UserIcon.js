import React, { Component } from "react";
import verifAuth from "../Auth/verifAuth";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import { DEFAULT_IMG } from "../Const/const";

class UserIcon extends Component {
	state = {
		isAuth: false,
		isMounted: false,
		user: []
	};

	componentDidMount() {
		Axios.defaults.headers.common["token"] = localStorage.getItem("token");
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
			if (isAuth) {
				Axios.get("/Profile").then(data => {
					this.setState({ user: data.data });
				});
			}
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
					<div>
						<span>{this.state.user.username}</span>
						<img
							src={this.state.user.image ? this.state.user.image : DEFAULT_IMG}
							onClick={this.redirectProfile.bind(this)}
							alt="profile"
						/>
					</div>
				)}
				<span className="logout" onClick={this.logout.bind(this)}>
					Log-Out
				</span>
			</div>
		);
	}
}
export default withRouter(UserIcon);
