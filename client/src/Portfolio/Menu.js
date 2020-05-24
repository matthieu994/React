import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import AnchorLink from "react-anchor-link-smooth-scroll";
import "./menu.css";

export default class Menu extends Component {
    state = {
        changeNav: false,
    };

    componentDidMount() {
        window.addEventListener("scroll", () => this.handleScroll());
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll() {
        this.setState({ changeNav: window.scrollY > window.innerHeight / 2 });
    }

    render() {
        return (
            <Navbar
                className="fadein-navbar"
                id="custom-navbar"
                bg={this.state.changeNav && "dark"}
                expand="md"
            >
                <Navbar.Brand className="logo">
                    <AnchorLink href="#Media">MP.</AnchorLink>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav>
                        <AnchorLink href="#Media">Accueil</AnchorLink>
                    </Nav>
                    <Nav>
                        <AnchorLink offset={60} href="#About">
                            À propos
                        </AnchorLink>
                    </Nav>
                    <Nav>
                        <AnchorLink offset={60} href="#Skills">
                            Compétences
                        </AnchorLink>
                    </Nav>
                    <Nav>
                        <AnchorLink offset={60} href="#Portfolio">
                            Portfolio
                        </AnchorLink>
                    </Nav>
                    <Nav>
                        <AnchorLink offset={60} href="#Experience">
                            Expérience
                        </AnchorLink>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
