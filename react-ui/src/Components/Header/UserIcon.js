import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Fa } from "mdbreact";
import Axios from "axios";
import { DEFAULT_IMG } from "../../Const/const";

class UserIcon extends Component {
	state = {
		isMounted: false,
		user: []
	};

	componentDidMount() {
		Axios.defaults.headers.common["token"] = localStorage.getItem("token");
		this.getData();

		this.unlisten = this.props.history.listen(() => {
			this.getData();
		});
	}

	getData() {
		Axios.get("/Profile/data").then(data => {
			this.setState({ isMounted: true, user: data.data });
		});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	logout() {
		localStorage.removeItem("token");
		this.props.history.push("/login");
	}

	redirectProfile() {
		this.props.history.push("/Profile");
	}

	render() {
		if (!this.state.isMounted) return null;

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
				<Button
					floating
					color="primary"
					className="logout"
					onClick={this.logout.bind(this)}>
					Logout
					<Fa icon="sign-out" />
				</Button>
			</div>
		);
	}
}
export default withRouter(UserIcon);
