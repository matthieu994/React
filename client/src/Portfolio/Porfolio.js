import React from "react";
import { Container } from "react-bootstrap";
import Menu from "./Menu";
import Media from "./Media";
import About from "./About";
import Projects from "./Projects";
import { desc, projects } from "./data";
import "./portfolio.css";
// import Experience from "./Experience"

const Portfolio = () => (
  <Container className="portfolio" fluid>
    <Menu />
    <Media />
    <About data={desc} />
    <Projects data={projects} />
    {/* <Experience /> */}
  </Container>
);

export default Portfolio;
