import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { Input, Button } from "mdbreact";
import { alert } from "../Components/Header";
import { connect } from "react-redux";
import {
	toggleLoginModal,
	hideLoginModal,
	displayLoginModal
} from "../redux/actions/index";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			usernameStatus: "",
			passwordStatus: ""
		};
		this.location = props.location.state || { from: { pathname: "/" } };
	}

	login(e) {
		e.preventDefault();
		if (!this.state.username || !this.state.password) {
			if (!this.state.username) {
				this.setIcon("envelope", "error");
				this.setState({ usernameStatus: "error" });
			}
			if (!this.state.password) {
				this.setIcon("lock", "error");
				this.setState({ passwordStatus: "error" });
			}
			return;
		}
		axios
			.post("/login", this.state)
			.then(res => {
				if (res.data.token) {
					alert.success("Connexion réussie !", "good_login");
					localStorage.setItem("token", res.data.token);
					this.props.hideLoginModal();
					this.props.history.push(this.location.from.pathname);
				} else {
					alert.error("Identifiants invalides !", "bad_login");
					this.setState({
						password: "",
						usernameStatus: "error",
						passwordStatus: "error"
					});
				}
			})
			.catch(err => console.log(err));
	}

	setIcon(icon, status, value) {
		var iconDOM = document.querySelector(".fa-" + icon);
		if (status === "error") iconDOM.style.color = "#f44242";
		if (status === "success") iconDOM.style.color = "#42f48c";
		if (value) iconDOM.style.color = "";
	}

	render() {
		this.setIcon("envelope", this.state.usernameStatus, this.state.username);
		this.setIcon("lock", this.state.passwordStatus, this.state.password);

		return (
			<div className="connect">
				<form>
					<Input
						label="Pseudo"
						icon="envelope"
						group
						validate
						type="text"
						status={!this.state.username ? this.state.usernameStatus : ""}
						value={this.state.username}
						onChange={e => this.setState({ username: e.target.value })}
					/>
					<Input
						label="Mot de passe"
						icon="lock"
						group
						validate
						type="password"
						status={!this.state.password ? this.state.passwordStatus : ""}
						value={this.state.password}
						onChange={e => this.setState({ password: e.target.value })}
					/>
					<Button type="submit" color="primary" onClick={this.login.bind(this)}>
						Se connecter
					</Button>
					<Link to="/register">Je n'ai pas de compte</Link>
				</form>
			</div>
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
		displayLoginModal: () => dispatch(displayLoginModal()),
		hideLoginModal: () => dispatch(hideLoginModal()),
		toggleLoginModal: () => dispatch(toggleLoginModal())
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Login)
);
