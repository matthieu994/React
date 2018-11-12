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
			isAuth: false
		};
		this.location = props.location.state || { from: { pathname: "/" } };
	}

	login(e) {
		e.preventDefault();
		axios
			.post("/login", this.state)
			.then(res => {
				if (res.data.token) {
					localStorage.setItem("token", res.data.token);
					this.setState({
						isAuth: true
					});
					this.props.hideLoginModal();
					this.props.history.push(this.location.from.pathname);
				} else alert.error("Identifiants invalides !", "bad_login");
			})
			.catch(err => console.log(err));
	}

	render() {
		if (this.state.isAuth) return null;
		return (
			<div className="connect">
				<form>
					<Input
						label="Pseudo"
						icon="envelope"
						group
						type="text"
						validate
						error="wrong"
						success="right"
						required
						onChange={e => this.setState({ username: e.target.value })}
					/>
					<Input
						label="Mot de passe"
						icon="lock"
						group
						type="password"
						validate
						required
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
		toggleLoginModal: () => dispatch(toggleLoginModal()),
		displayLoginModal: () => dispatch(displayLoginModal()),
		hideLoginModal: () => dispatch(hideLoginModal())
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Login)
);
