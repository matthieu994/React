import React, { Component } from "react";
import Menu from "./Menu";
import Media from "./Media";
import About from "./About";
import Skills from "./Skills";
import { Container } from "react-bootstrap";
// import Experience from "./Experience"

export default class Portfolio extends Component {
    render() {
        return (
            <Container className="portfolio" fluid>
                <Menu />
                <Media />
                <About />
                <Skills />
                {/* <Projects /> */}
                {/* <Experience /> */}
            </Container>
        );
    }
}
