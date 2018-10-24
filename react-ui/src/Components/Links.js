import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import verifAuth from "../Auth/verifAuth";
import UserIcon from "../Components/UserIcon";
import "./Links.css";
import { toggleLoginModal } from "../redux/actions/index";

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
			this.setState(
				{
					isMounted: true,
					isAuth
				},
				() => this.handleUrl()
			);
		});
	}

	handleUrl() {
		if (
			!this.state.isAuth &&
			this.state.isMounted &&
			this.props.location.pathname !== "/" &&
			this.props.location.pathname !== "/register" &&
			this.props.location.pathname !== "/login"
		) {
			this.props.history.push("/login");
		}
	}

	componentWillUnmount() {
		this.unlisten();
	}

	render() {
		// this.changeLocation();
		let login = (
			<a className="login" onClick={() => this.props.toggleLoginModal()}>
				Login
			</a>
		);
		let register = (
			<Link className="register" to={"/register"}>
				Register
			</Link>
		);
		let links;
		if (this.state.isMounted && !this.state.isAuth) {
			links = (
				<div className="auth">
					{this.props.location.pathname === "/login" && (
						<div className="register">
							<span>Pas de compte ?</span>
							{register}
						</div>
					)}
					{this.props.location.pathname === "/register" && (
						<div className="login">
							<span>Déjà inscrit ?</span>
							{login}
						</div>
					)}
					{this.props.location.pathname !== "/register" &&
						this.props.location.pathname !== "/login" && (
							<div className="buttons">
								{login}
								{register}
							</div>
						)}
				</div>
			);
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

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Links)
);
