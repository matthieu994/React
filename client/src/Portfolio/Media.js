import React, { Component } from "react";
import { Container, Image } from "react-bootstrap";
import Typical from "react-typical";
import "./media.css";

class Media extends Component {
    render() {
        return (
            <Container className="media" id="Media" fluid>
                <Image src={"/images/portfolio_background.jpg"} alt="background-me"></Image>
                {/* <p id="i-am">Je suis</p> */}
                <Typical
                    className="write-auto"
                    steps={["Matthieu Petit.", 2000, "Développeur Web.", 2000]}
                    loop={Infinity}
                    wrapper="p"
                />
            </Container>
        );
    }
}
export default Media;
