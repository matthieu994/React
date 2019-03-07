import React, { Component } from "react";
import "./preloader.css";

export default class Portfolio extends Component {
    constructor() {
        super()
        window.location.replace(
            "https://portfolio-matthieu-apps.herokuapp.com/"
        );
    }

    render() {
        return <div id="preloader">Redirection en cours...</div>;
    }
}
