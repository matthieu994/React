import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { Button, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { FaLock, FaUser, FaEyeSlash, FaEye } from "react-icons/fa";
import { connect } from "react-redux";
import { toggleLoginModal, hideLoginModal, displayLoginModal } from "../redux/actions/index";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      passwordVerif: null,
      isLoading: false,
    };
    this.location = props.location.state || { from: { pathname: "/" } };
  }

  register(e) {
    e.preventDefault();

    if (!this.state.username || this.state.username.trim().length < 3)
      return this.setState({ usernameError: "Le nom d'utilisateur est trop court." });
    if (!this.state.password || this.state.password.trim().length < 3)
      return this.setState({ passwordError: "Le mot de passe est trop court." });
    if (this.state.password.trim() !== this.state.passwordVerif.trim())
      return this.setState({ passwordError: "Les mots de passe ne correspondent pas." });

    axios
      .post("/register", this.state)
      .then((res) => {
        if (res.status === 200) this.login();
      })
      .catch((err) => {
        if (err.response.status === 400) {
          return this.setState({ usernameError: "Le nom d'utilisateur existe déjà." });
        }
      });
  }

  login() {
    axios
      .post("/login", this.state)
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          this.props.hideLoginModal();
          this.props.history.push(this.location.from.pathname);
        }
      })
      .catch((err) => console.log(err));
  }

  handleChange(e, type) {
    let value = e.target.value.trim();
    if (type === "password" || type === "passwordVerif") {
      if (type === "passwordVerif") {
        this.setState({ passwordVerif: value }, () => {
          this.comparePassword();
        });
      } else {
        if (value.length < 3) this.setState({ passwordError: "Le mot de passe est trop court." });
        else this.setState({ passwordError: null });
        this.setState({ password: value }, () => {
          this.comparePassword();
        });
      }
    }

    if (type === "username") {
      if (value.length < 3)
        this.setState({ usernameError: "Le nom d'utilisateur est trop court." });
      else this.setState({ usernameError: null });
      this.setState({ username: value });
    }
  }

  comparePassword() {
    if (this.state.passwordVerif !== this.state.password)
      this.setState({
        passwordVerifError: "Les mots de passe ne correspondent pas.",
      });
    else this.setState({ passwordVerifError: null });
  }

  togglePassword() {
    this.setState({ viewPassword: !this.state.viewPassword });
  }

  canRegister() {
    return (
      !this.state.usernameError &&
      !this.state.passwordError &&
      !this.state.passwordVerifError &&
      this.state.username &&
      this.state.username.length >= 3 &&
      this.state.password &&
      this.state.password.length >= 3 &&
      this.state.password === this.state.passwordVerif &&
      !this.state.isLoading
    );
  }

  render() {
    return (
      <div className="connect">
        <Form noValidate>
          <Form.Group as={Row} controlId="registerUsername">
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
          <Form.Group as={Row} controlId="registerPassword">
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
          <Form.Group as={Row} controlId="registerPasswordVerif">
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
                  this.state.passwordVerif &&
                  this.state.passwordVerif.length >= 3 &&
                  !this.state.passwordVerifError
                }
                isInvalid={
                  this.state.passwordVerif !== null &&
                  (this.state.passwordVerif.length < 3 || this.state.passwordVerifError)
                }
                value={this.state.passwordVerif || ""}
                onChange={(e) => this.handleChange(e, "passwordVerif")}
              />
              <Form.Control.Feedback type="invalid">
                {this.state.passwordVerifError}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Button
            disabled={!this.canRegister()}
            type="submit"
            size="sm"
            onClick={this.register.bind(this)}
          >
            {this.state.isLoading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              "Créer un compte"
            )}
          </Button>
          <Link to="/login">J'ai déjà un compte</Link>
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
    toggleLoginModal: () => dispatch(toggleLoginModal()),
    displayLoginModal: () => dispatch(displayLoginModal()),
    hideLoginModal: () => dispatch(hideLoginModal()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
