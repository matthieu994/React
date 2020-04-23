import React, { Component } from "react";
import { render } from "react-dom";
// eslint-disable-next-line
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/store/index";
import Routes from "./Routes";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import "font-awesome/css/font-awesome.min.css";
// import 'bootstrap-css-only/css/bootstrap.min.css';
import "mdbreact/dist/css/mdb.css";
import "./index.css";

class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div>
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
