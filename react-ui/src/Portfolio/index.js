import React, { Component } from "react";
import "./preloader.css";

export default class Portfolio extends Component {
    componentDidMount() {
        window.location.reload(true);
    }

    render() {
        return <div id="preloader" />;
    }
}