import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import verifAuth from "../Auth/verifAuth";
import "./Links.css";
import Redirect from "react-router-dom/Redirect";

class Links extends Component {
	state = {
		isAuth: false,
		isMounted: false
	};

	componentDidMount() {
		verifAuth().then(isAuth => {
			this.setState({
				isMounted: true,
				isAuth
			});
		});
	}

	render() {
		let links;
		if (this.state.isMounted && this.state.isAuth) {
			if (this.props.location.pathname === "/login") {
				links = (
					<div className="register">
						<span>Pas de compte ?</span>
						<button onClick={() => this.props.history.push("/register")}>
							S'inscrire
						</button>
					</div>
				);
			} else if (this.props.location.pathname === "/register") {
				links = (
					<div className="login">
						<span>Déjà inscrit ?</span>
						<button onClick={() => this.props.history.push("/login")}>
							Se connecter
						</button>
					</div>
				);
			} else {
				links = (
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
				);
			}
		} else if (
			this.state.isMounted &&
			!this.state.isAuth &&
			this.props.location.pathname !== "/" &&
			this.props.location.pathname !== "/register" &&
			this.props.location.pathname !== "/login"
		) {
			links = <Redirect to="/login" />;
		}

		return (
			<div>
				<div className="nav-links">{links}</div>
				{this.props.location.pathname !== "/" && (
					<i
						className="fas fa-home btn btn-primary"
						onClick={() => this.props.history.push("/")}
					/>
				)}
			</div>
		);
	}
}

export default withRouter(Links);
