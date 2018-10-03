import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import verifAuth from "../Auth/verifAuth";
import UserIcon from "../Components/UserIcon";
import "./Links.css";

class Links extends Component {
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

	render() {
		// this.changeLocation();
		let links;
		if (this.state.isMounted && !this.state.isAuth) {
			links = (
				<div className="auth">
					{this.props.location.pathname === "/login" && (
						<div className="register">
							<span>Pas de compte ?</span>
							<button onClick={() => this.props.history.push("register")}>
								S'inscrire
							</button>
						</div>
					)}
					{this.props.location.pathname === "/register" && (
						<div className="login">
							<span>Déjà inscrit ?</span>
							<button onClick={() => this.props.history.push("login")}>
								Se connecter
							</button>
						</div>
					)}
					{this.props.location.pathname !== "/register" &&
						this.props.location.pathname !== "/login" && (
							<div className="auth">
								<a className="login" onClick={() => this.props.history.push("/login")}>
									Login
								</a>
								<button
									className="register"
									onClick={() => this.props.history.push("register")}>
									Register
								</button>
							</div>
						)}
				</div>
			);
		}
		if (
			this.state.isMounted &&
			!this.state.isAuth &&
			this.props.location.pathname !== "/" &&
			this.props.location.pathname !== "/register" &&
			this.props.location.pathname !== "/login"
		) {
			this.props.history.push("/login");
		}

		return (
			<header>
				{links}
				{this.props.location.pathname !== "/" && (
					<i
						className="fas fa-home btn btn-primary"
						onClick={() => this.props.history.push("/")}
					/>
				)}
				{this.state.isMounted && this.state.isAuth && <UserIcon />}
			</header>
		);
	}
}

export default withRouter(Links);
