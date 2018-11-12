import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { alert } from "../Components/Header";
import { connect } from "react-redux";
import {
	toggleLoginModal,
	hideLoginModal,
	displayLoginModal
} from "../redux/actions/index";

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			password2: "",
			alert: "",
			isAuth: false
		};
		this.location = props.location.state || { from: { pathname: "/" } };
	}

	register(e) {
		e.preventDefault();
		if (this.state.username.trim().length < 3) return this.alert("USERNAME_SHORT");
		if (this.state.password.trim().length < 3) return this.alert("PASSWORD_SHORT");
		if (this.state.password.trim().length !== this.state.password2.trim().length)
			return this.alert("PASSWORD_MATCH");

		axios
			.post("/register", this.state)
			.then(res => {
				if (res.status === 200) this.login();
			})
			.catch(err => {
				if (err.response.status === 400) {
					this.alert("USERNAME_MATCH");
				}
			});
	}

	login() {
		axios
			.post("/login", this.state)
			.then(res => {
				if (res.data.token) {
					localStorage.setItem("token", res.data.token);
					this.props.history.push(this.location.from.pathname);
				}
			})
			.catch(err => console.log(err));
	}

	alert(message) {
		alert.error(message, "register_error");
	}

	render() {
		let userStatus, passStatus, pass2Status;
		if (this.state.alert === "USERNAME_SHORT" || this.state.alert === "USERNAME_MATCH")
			userStatus = "error";
		if (this.state.alert.split("_")[0] === "PASSWORD") {
			passStatus = "error";
			if (this.state.alert === "PASSWORD_MATCH") {
				pass2Status = "error";
			}
		}

		return (
			<div className="connect">
				<form>
					<div className="form-group">
						<input
							type="text"
							status={userStatus}
							className="form-control"
							placeholder="Pseudo"
							required
							onChange={e => this.setState({ username: e.target.value })}
						/>
					</div>
					<div className="form-group">
						<input
							type="password"
							status={passStatus}
							className="form-control"
							placeholder="Mot de passe"
							required
							onChange={e => this.setState({ password: e.target.value })}
						/>
					</div>
					<div className="form-group">
						<input
							type="password"
							status={pass2Status}
							className="form-control"
							placeholder="Mot de passe"
							required
							onChange={e => this.setState({ password2: e.target.value })}
						/>
					</div>
					<button
						type="submit"
						className="btn btn-primary"
						onClick={this.register.bind(this)}>
						Créer un compte
					</button>
					<Link to="/login">J'ai déjà un compte</Link>
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
	)(Register)
);
