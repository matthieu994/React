import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { Button, Form, Row, InputGroup, Spinner } from "react-bootstrap";
import { FaLock, FaUser, FaEyeSlash, FaEye } from "react-icons/fa";
import { connect } from "react-redux";
import { toggleLoginModal, hideLoginModal, displayLoginModal } from "../redux/actions/index";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      usernameError: null,
      passwordError: null,
      isLoading: false,
    };
    this.location = props.location.state || { from: { pathname: "/" } };
  }

  login(e) {
    e.preventDefault();

    this.setState({ isLoading: true });
    if (!this.state.username || this.state.username.trim().length < 3)
      return this.setState({ usernameError: "Le nom d'utilisateur est trop court." });
    if (!this.state.password || this.state.password.trim().length < 3)
      return this.setState({ passwordError: "Le mot de passe est trop court." });

    axios
      .post("/login", this.state)
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          this.props.hideLoginModal();
          this.props.history.push(this.location.from.pathname);
        } else {
          if (res.data.code === 1)
            this.setState({
              password: "",
              usernameError: res.data.message,
            });
          if (res.data.code === 2)
            this.setState({
              password: "",
              passwordError: res.data.message,
            });
        }
      })
      .catch((err) => console.log(err));
  }

  handleChange(e, type) {
    const value = e.target.value.trim();
    if (type === "password") {
      if (value.length < 3) this.setState({ passwordError: "Le mot de passe est trop court." });
      else this.setState({ passwordError: null });
      this.setState({ password: value });
    } else {
      if (value.length < 3)
        this.setState({ usernameError: "Le nom d'utilisateur est trop court." });
      else this.setState({ usernameError: null });
      this.setState({ username: value });
    }
  }

  togglePassword() {
    this.setState({ viewPassword: !this.state.viewPassword });
  }

  canLogin() {
    return (
      !this.state.usernameError &&
      !this.state.passwordError &&
      !this.state.passwordVerifError &&
      this.state.username &&
      this.state.username.length >= 3 &&
      this.state.password &&
      this.state.password.length >= 3 &&
      !this.state.isLoading
    );
  }

  render() {
    return (
      <div className="connect">
        <Form noValidate>
          <Form.Group as={Row} controlId="loginUsername">
            <Form.Label>Pseudo</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                placeholder="Pseudo"
                icon="envelope"
                type="text"
                isValid={
                  this.state.username &&
                  this.state.username.length >= 3 &&
                  !this.state.usernameError
                }
                isInvalid={
                  this.state.username !== null &&
                  (this.state.username.length < 3 || this.state.usernameError)
                }
                value={this.state.username || ""}
                onChange={(e) => this.handleChange(e, "username")}
              />
              <Form.Control.Feedback type="invalid">
                {this.state.usernameError}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Row} controlId="loginPassword">
            <Form.Label>Mot de passe</Form.Label>
            <InputGroup className="password">
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                placeholder="Mot de passe"
                type={this.state.viewPassword ? "text" : "password"}
                isValid={
                  this.state.password &&
                  this.state.password.length >= 3 &&
                  !this.state.passwordError
                }
                isInvalid={
                  this.state.password !== null &&
                  (this.state.password.length < 3 || this.state.passwordError)
                }
                value={this.state.password || ""}
                onChange={(e) => this.handleChange(e, "password")}
              />
              <InputGroup.Append onClick={() => this.togglePassword()}>
                <InputGroup.Text>
                  <Button variant="light" size="sm" tabIndex={-1}>
                    {this.state.viewPassword ? <FaEye /> : <FaEyeSlash />}
                  </Button>
                </InputGroup.Text>
              </InputGroup.Append>
              <Form.Control.Feedback type="invalid">
                {this.state.passwordError}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Button
            disabled={!this.canLogin()}
            type="submit"
            size="sm"
            onClick={this.login.bind(this)}
          >
            {this.state.isLoading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              "Connexion"
            )}
          </Button>
          <Link to="/register">Je n'ai pas de compte</Link>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.toggleLoginModal.loginModal,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    displayLoginModal: () => dispatch(displayLoginModal()),
    hideLoginModal: () => dispatch(hideLoginModal()),
    toggleLoginModal: () => dispatch(toggleLoginModal()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
