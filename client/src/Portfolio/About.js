import React, { Component } from "react";
import { Container, Col, Row, Image, Button, Card } from "react-bootstrap";
import {
  FaGithub,
  FaLinkedin,
  FaStackOverflow,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import "./about.css";

class About extends Component {
  state = {
    large: true,
  };

  render() {
    return (
      <Container className="about" fluid id="About">
        <Row>
          <Col>
            <h1>À PROPOS</h1>
          </Col>
        </Row>
        <Row>
          <Col>{Img}</Col>
          <Col id="social-desc">
            {Social}
            {Desc}
          </Col>
        </Row>
      </Container>
    );
  }
}

const Img = (
  <Image src={"/images/portfolio_about.jpg"} alt="aboutPicture" className="media-about"></Image>
);

const Desc = (
  <Card id="desc">
    <Card.Header>MON PROFIL</Card.Header>
    <Card.Body>
      <p>
        Après une première année de DUT Informatique à l'IUT de Sénart-Fontainebleau, je continue
        ma formation en échange à l'UQAM, à Montréal. <br/>
        Je commence déjà à développer un intérêt pour les technologies Web et l'UX/UI, 
        je décide de me lancer en tant que Développeur Web freelance. <br/>
        Après avoir obtenu mon DUT, je pars étudier dans une école d'ingénieur à Grenoble : l'ENSIMAG.
        Je rejoins la Junior Entreprise de l'école et je réalise mes premières missions.
      </p>
    </Card.Body>
  </Card>
);

const Social = (
  <Card id="social">
    <Card.Header>RÉSEAUX</Card.Header>
    <Card.Body>
      <Row>
        <Button className="github-button" href="https://github.com/matthieu994" target="_blank">
          <FaGithub />
          GitHub
        </Button>
        <Button
          className="linkedin-button"
          href="https://www.linkedin.com/in/matthieu994"
          target="_blank"
        >
          <FaLinkedin />
          LinkedIn
        </Button>
        <Button
          className="stack-button"
          href="https://stackoverflow.com/users/8827585/matthieu994"
          target="_blank"
        >
          <FaStackOverflow />
          StackOverflow
        </Button>
      </Row>
      <Row>
        <Button className="phone" href="tel:+33767329786" target="_blank">
          <FaPhone />
          +33 7 67 32 97 86
        </Button>
        <Button className="email" href="mailto:contact@matthieupetit.com" target="_blank">
          <FaEnvelope />
          contact@matthieupetit.com
        </Button>
      </Row>
    </Card.Body>
  </Card>
);

export default About;
