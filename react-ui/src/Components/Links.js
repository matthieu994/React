import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import verifAuth from "../Auth/verifAuth";
import UserIcon from "../Components/UserIcon";
import "./Links.css";
import { connect } from "react-redux";
import {
	toggleLoginModal,
	displayLoginModal,
	hideLoginModal
} from "../redux/actions/index";
import Modal from "../Components/Modal";
import Login from "../Auth/Login";
import Register from "../Auth/Register";

class Links extends Component {
	state = {
		isAuth: false,
		isMounted: false,
		authComponent: "Login"
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
			this.props.location.pathname !== "/"
		) {
			this.props.displayLoginModal();
			if (this.props.location.pathname === "/login")
				this.setState({ authComponent: "Login" });
			if (this.props.location.pathname === "/register")
				this.setState({ authComponent: "Register" });
		}
	}

	componentWillUnmount() {
		this.unlisten();
	}

	renderLinks() {
		let login = (
			<span
				className="login"
				onClick={() =>
					this.props.history.push("/login") && this.setState({ authComponent: "Login" })
				}>
				Login
			</span>
		);
		let register = (
			<span
				className="register"
				onClick={() =>
					this.props.history.push("/register") &&
					this.setState({ authComponent: "Register" })
				}>
				Register
			</span>
		);
		if (this.state.isMounted && !this.state.isAuth) {
			return (
				<div className="auth">
					{this.props.location.pathname === "/login" && (
						<div className="register">Pas de compte ?{register}</div>
					)}
					{this.props.location.pathname === "/register" && (
						<div className="login">Déjà inscrit ?{login}</div>
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
	}

	render() {
		return (
			<>
				<header>
					{this.renderLinks()}
					{this.props.location.pathname !== "/" && (
						<i
							className="fas fa-home btn btn-primary"
							onClick={() => this.props.hideLoginModal() && this.props.history.push("/")}
						/>
					)}
					{this.state.isMounted && this.state.isAuth && <UserIcon />}
				</header>
				<Modal
					display={this.props.modal}
					component={this.state.authComponent === "Login" ? Login : Register}
				/>
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		modal: state.toggleLoginModal.loginModal
	};
};
const mapDispatchToProps = dispatch => {
	return {
		toggleLoginModal: () => dispatch(toggleLoginModal()),
		displayLoginModal: () => dispatch(displayLoginModal()),
		hideLoginModal: () => dispatch(hideLoginModal())
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Links)
);
