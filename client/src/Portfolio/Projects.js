import React from "react";
import { Container, Row, Col, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaHourglassEnd, FaUserFriends, FaUser } from "react-icons/fa";
import "./projects.css";

const Tech = (techs) => {
  return (
    <Card.Footer>
      {techs.map((tech) => (
        <OverlayTrigger key={tech.name} placement="top" overlay={<Tooltip>{tech.name}</Tooltip>}>
          <span>{tech.jsx}</span>
        </OverlayTrigger>
      ))}
    </Card.Footer>
  );
};

const Projects = (props) => {
  const { data } = props || [];

  return (
    <Container className="projects" fluid id="Projects">
      <h1>Portfolio</h1>
      <Row className="row-custom-xp pb-5">
        {data.map((project) => {
          const multImages = typeof project.img === "object";
          return (
            <Col md="4" lg="3" key={project.title}>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <Card>
                  <Card.Header>
                    {multImages ? (
                      <div className="images">
                        {project.img.map((link) => (
                          <Card.Img key={link} src={link} alt="project picture" />
                        ))}
                      </div>
                    ) : (
                      <Card.Img src={project.img} alt="project picture" />
                    )}
                    <Card.Title>{project.title}</Card.Title>
                    <Card.Subtitle>{project.desc}</Card.Subtitle>
                  </Card.Header>
                  <Card.Body>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{`${project.days || 0} jours`}</Tooltip>}
                    >
                      <span>
                        <FaHourglassEnd />
                        {`${project.days || 0}`}
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>{`${project.people || 1} développeur${
                          project.people > 1 ? "s" : ""
                        }`}</Tooltip>
                      }
                    >
                      <span>
                        {project.people > 1 ? <FaUserFriends /> : <FaUser />}
                        {project.people || 1}
                      </span>
                    </OverlayTrigger>
                  </Card.Body>
                  {Tech(project.techs || [])}
                </Card>
              </a>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Projects;
