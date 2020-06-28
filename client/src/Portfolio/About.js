import React, { Component } from "react";
import { Container, Col, Row, Image, Button, Card } from "react-bootstrap";
import { FaGithub, FaLinkedin, FaStackOverflow, FaEnvelope, FaPhone } from "react-icons/fa";
import "./about.css";

class About extends Component {
  state = {
    large: true,
  };

  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    if (this.state.large && window.innerWidth < 1010) this.setState({ large: false });
    if (!this.state.large && window.innerWidth > 1010) this.setState({ large: true });
  }

  desc() {
    return (
      <Card id="desc">
        <Card.Header>Mon profil</Card.Header>
        <Card.Body>
          <p>{this.props.data}</p>
        </Card.Body>
      </Card>
    );
  }

  render() {
    return (
      <Container className="about" fluid id="About">
        <Row>
          <Col>
            <h1>À propos</h1>
          </Col>
        </Row>
        {this.state.large ? (
          <Row className="large">
            <Col>{Img}</Col>
            <Col id="social-desc">
              {Social}
              {this.desc()}
            </Col>
          </Row>
        ) : (
          <Container fluid className="small">
            <Row>
              <Col xs={6}>{Img}</Col>
              <Col xs={6}>{Social}</Col>
            </Row>
            <Row>{this.desc()}</Row>
          </Container>
        )}
      </Container>
    );
  }
}

const Img = <Image src="/images/portfolio_about.jpg" alt="aboutPicture" className="media-about" />;

const Social = (
  <Card id="social">
    <Card.Header>Réseaux</Card.Header>
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
