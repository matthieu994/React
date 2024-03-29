import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { IoIosMoon } from "react-icons/io";
import "./index.scss";

export default class NightShift extends Component {
    state = {
        on: localStorage.getItem("nightshift"),
    };

    componentDidMount() {
        this.display();
    }

    toggle() {
        this.setState({ on: !this.isOn() }, () => {
            localStorage.setItem("nightshift", this.state.on);
            this.display();
        });
    }

    isOn() {
        if (this.state.on === true || this.state.on === "true") return true;
        else return false;
    }

    display() {
        let div = document.querySelector("div.nightshift");
        if (!this.isOn() && div) {
            document.body.removeChild(div);
        } else if (this.isOn()) {
            div = document.createElement("div");
            div.className = "nightshift";
            document.body.prepend(div);
        }
    }

    render() {
        return (
            <Button
                className="nightshift"
                color={this.isOn() ? "indigo" : ""}
                onClick={() => this.toggle()}
            >
                <IoIosMoon />
            </Button>
        );
    }
}
