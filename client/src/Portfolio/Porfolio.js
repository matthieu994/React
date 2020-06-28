import React from "react";
import { Container } from "react-bootstrap";
import Menu from "./Menu";
import Media from "./Media";
import About from "./About";
import Projects from "./Projects";
import { desc, projects, exp } from "./data";
import Experience from "./Experience";
import "./portfolio.css";

const Portfolio = () => (
  <Container className="portfolio" fluid>
    <Menu />
    <Media />
    <About data={desc} />
    <Projects data={projects} />
    <Experience data={exp} />
  </Container>
);

export default Portfolio;
