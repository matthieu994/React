import React, { Component } from "react";
import "./preloader.css";
import axios from "axios";

export default class Portfolio extends Component {
    componentDidMount() {
        axios.defaults.headers.common["token"] = localStorage.getItem("token");
        this.get();
    }

    get() {
        axios
            .get("/Portfolio")
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err));
    }

    render() {
        return <div id="preloader" />;
    }
}
