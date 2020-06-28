import React from "react";
// import { Timeline, TimelineEvent } from "react-vertical-timeline-component";
import { Container, Row, Col } from "react-bootstrap";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "./experience.css";
import { FaSuitcase, FaSchool, FaStar } from "react-icons/fa";

const Experience = (props) => {
  const { data } = props || [];
  data.sort((a, b) => Date.parse(b.start) - Date.parse(a.start));

  return (
    <Container fluid id="Experience">
      <Row>
        <Col>
          <h1>Experience</h1>
        </Col>
      </Row>
      <Row>
        <VerticalTimeline>
          {data.map((exp) => (
            <VerticalTimelineElement
              key={exp.start}
              className={`${exp.type} ${!exp.end && "current"}`}
              date={`${new Date(exp.start).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })} - ${
                exp.end
                  ? new Date(exp.end).toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })
                  : "maintenant"
              }`}
              icon={exp.type === "work" ? <FaSuitcase /> : <FaSchool />}
            >
              <h3 className="vertical-timeline-element-title">{exp.title}</h3>
              <h5 className="vertical-timeline-element-subtitle">{exp.location}</h5>
              <p>{exp.desc}</p>
            </VerticalTimelineElement>
          ))}
          <VerticalTimelineElement
            iconStyle={{ background: "rgb(4, 45, 85)", color: "#fff" }}
            icon={<FaStar />}
          />
        </VerticalTimeline>
      </Row>
    </Container>
  );
};

export default Experience;
