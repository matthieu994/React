import React, { Component } from "react";
import { render } from "react-dom";
// eslint-disable-next-line
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/store/index";
import Routes from "./Routes";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
// import 'bootstrap-css-only/css/bootstrap.min.css';
import "./index.css";
import IdentityProvider from "./Components/Header/IdentityProvider";

class Root extends Component {
    // constructor() {
    //     super();
    //     let isLocal = window.location.host.split(".")[0];
    // }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div>
                        <IdentityProvider />
                        <Header />
                        <Routes />
                        <Footer />
                    </div>
                </Router>
            </Provider>
        );
    }
}

render(<Root />, document.getElementById("root"));
