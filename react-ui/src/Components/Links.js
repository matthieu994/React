import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import verifAuth from "../Auth/verifAuth";
import UserIcon from "../Components/UserIcon";
import "./Links.css";
import { connect } from "react-redux";
import { toggleLoginModal } from "../redux/actions/index";
import Modal from "../Components/Modal";
import Login from "../Auth/Login"

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
			this.props.toggleLoginModal();
		}
	}

	componentWillUnmount() {
		this.unlisten();
	}

	renderLinks() {
		let login = (
			<span className="login" onClick={() => this.props.toggleLoginModal()}>
				Login
			</span>
		);
		let register = (
			<Link className="register" to={"/register"}>
				Register
			</Link>
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
							onClick={() => this.props.history.push("/")}
						/>
					)}
					{this.state.isMounted && this.state.isAuth && <UserIcon />}
				</header>
				<Modal display={this.props.modal} component={Login} />
			</>
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
