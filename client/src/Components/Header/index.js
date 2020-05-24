import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { ToastContainer, Slide, toast } from "react-toastify";
import verifAuth from "../../Auth/verifAuth";
import UserIcon from "./UserIcon";
import "./Header.css";
import Modal from "../../Components/Modal";
import Login from "../../Auth/Login";
import Register from "../../Auth/Register";
import {
  toggleLoginModal,
  displayLoginModal,
  hideLoginModal,
  setAuth,
} from "../../redux/actions/index";
import { FaHome } from "react-icons/fa";

class Header extends Component {
  state = {
    isAuth: false,
    isMounted: false,
    authComponent: "Login",
    displayHeader: false,
  };

  componentDidMount() {
    this.unlisten = this.props.history.listen(() => {
      this.isAuth();
    });
    this.isAuth();
  }

  isAuth() {
    verifAuth().then((isAuth) => {
      this.setState(
        {
          isMounted: true,
          isAuth,
        },
        () => {
          this.handleUrl();
          this.props.setAuth(isAuth);
        }
      );
    });
  }

  handleUrl() {
    this.setState({
      displayHeader:
        window.location.pathname.toLowerCase() !== "/portfolio" &&
        window.location.host.split(".")[0] !== "portfolio",
    });

    if (this.state.isMounted) {
      if (
        this.state.isAuth &&
        (this.props.location.pathname === "/login" || this.props.location.pathname === "/register")
      )
        return this.props.history.replace("/");
      if (this.props.location.pathname !== "/login" && this.props.location.pathname !== "/register")
        return this.props.hideLoginModal();
      this.props.displayLoginModal();
      if (this.props.location.pathname === "/login") this.setState({ authComponent: "Login" });
      if (this.props.location.pathname === "/register")
        this.setState({ authComponent: "Register" });
    }
  }

  closeModal = () => {
    this.props.history.push("/");
  };

  componentWillUnmount() {
    this.unlisten();
  }

  renderLinks() {
    let login = (
      <Button
        color="primary"
        className="login"
        onClick={() =>
          this.props.history.push("/login") && this.setState({ authComponent: "Login" })
        }
      >
        Me connecter
      </Button>
    );
    let register = (
      <Button
        color="light-blue"
        className="register"
        onClick={() =>
          this.props.history.push("/register") && this.setState({ authComponent: "Register" })
        }
      >
        M'enregistrer
      </Button>
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
    if (!this.state.displayHeader) return null;
    return (
      <>
        <header>
          {this.props.location.pathname !== "/" && (
            <Button className="home" onClick={() => this.props.history.push("/")}>
              <FaHome />
            </Button>
          )}
          <Alerts />
          {this.renderLinks()}
          {this.state.isMounted && this.state.isAuth && <UserIcon />}
        </header>
        <Modal
          display={this.props.modal && !this.state.isAuth && this.state.isMounted}
          component={this.state.authComponent === "Login" ? Login : Register}
          onClose={this.closeModal}
        />
      </>
    );
  }
}

export const alert = {
  error: (message, id) => {
    toast.error(message, {
      toastId: id,
    });
  },
  success: (message, id) => {
    toast.success(message, {
      toastId: id,
    });
  },
};
class Alerts extends Component {
  render() {
    return (
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        rtl={false}
        pauseOnHover={false}
        transition={Slide}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.toggleLoginModal.loginModal,
    isAuth: state.setAuth.isAuth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleLoginModal: () => dispatch(toggleLoginModal()),
    displayLoginModal: () => dispatch(displayLoginModal()),
    hideLoginModal: () => dispatch(hideLoginModal()),
    setAuth: (bool) => dispatch(setAuth(bool)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
