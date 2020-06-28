import React from "react";
import { Container, Image } from "react-bootstrap";
import Typical from "react-typical";
import "./media.css";

const Media = () => (
  <Container id="Media" fluid>
    <Image src="/images/portfolio_background.jpg" alt="background-me" />
    <Typical
      className="write-auto"
      steps={["Matthieu Petit.", 2000, "Développeur Web.", 2000]}
      loop={Infinity}
      wrapper="p"
    />
    <a
      className="legend"
      href="https://romain-roellet-portfolio.format.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      picture by Romain Roellet
    </a>
  </Container>
);

export default Media;
