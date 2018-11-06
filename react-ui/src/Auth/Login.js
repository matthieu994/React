import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import verifAuth from "../Auth/verifAuth";
import "./Login.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { connect } from "react-redux";
import {
	toggleLoginModal,
	hideLoginModal,
	displayLoginModal
} from "../redux/actions/index";

class Login extends Component {
	_mounted = false;

	constructor(props) {
		super();
		this.state = {
			username: "",
			password: "",
			redirect: false,
			alert: "",
			isAuth: false
		};
		this.location = props.location.state || { from: { pathname: "/" } };
	}

	componentWillMount() {
		this._mounted = true;
		// this.verifAuth();
	}

	verifAuth() {
		verifAuth().then(isAuth => {
			if (this._mounted)
				this.setState({
					isAuth
				});
			if (isAuth) this.props.history.push(this.location.from.pathname);
			if (this.props.location.pathname === "/login") {
				this.props.displayLoginModal();
			}
		});
	}

	componentWillUnmount() {
		this._mounted = false;
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
				} else {
					toast.error("Identifiants invalides.");
				}
			})
			.catch(err => console.log(err));
	}

	render() {
		if (this.state.isAuth) return null;
		return (
			<>
				<div className="connect">
					<form>
						<div className="form-group">
							<input
								type="text"
								className="form-control"
								placeholder="Pseudo"
								onChange={e => this.setState({ username: e.target.value })}
							/>
						</div>
						<div className="form-group">
							<input
								type="password"
								className="form-control"
								placeholder="Mot de passe"
								onChange={e => this.setState({ password: e.target.value })}
							/>
						</div>
						<button
							type="submit"
							className="btn btn-primary"
							onClick={this.login.bind(this)}>
							Se connecter
						</button>
						<Link to="/register">Je n'ai pas de compte</Link>
					</form>
				</div>
				<ToastContainer
					position="top-center"
					autoClose={2500}
					hideProgressBar={true}
					rtl={false}
					pauseOnHover={false}
					transition={Zoom}
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
	)(Login)
);
