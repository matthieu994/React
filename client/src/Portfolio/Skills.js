import React, { Component } from "react";
import TagCloud from "react-tag-cloud";
import { Container } from "react-bootstrap";
import "./skills.css";

class App extends Component {
    componentDidMount() {
        setInterval(() => {
            this.forceUpdate();
        }, 4000);
    }
    render() {
        return (
            <Container className="skills" fluid id="Skills">
                <h1>COMPÉTENCES</h1>
                <div className="app-outer">
                    <div className="app-inner">
                        <TagCloud
                            className="tag-cloud"
                            style={{
                                fontFamily: "Poppins",
                                //fontSize: () => Math.round(Math.random() * 50) + 16,
                                fontSize: 30,
                                padding: 5,
                            }}
                        >
                            {[
                                "Javascript",
                                "React",
                                "Express",
                                "Node",
                                "Git",
                                "Scrum",
                                "Html5",
                                "CSS3",
                                "MongoDB",
                                "MySQL",
                                "Firebase",
                                "Agile",
                                "Api",
                                "Less",
                                "Bootstrap",
                                "Redux",
                                "Npm",
                                "Photoshop",
                                "Ecmascript6",
                            ].map((tag, index) => {
                                return <div key={index}>{tag}</div>;
                            })}
                        </TagCloud>
                    </div>
                </div>
            </Container>
        );
    }
}

export default App;
