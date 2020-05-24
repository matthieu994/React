import React, { Component } from 'react';
import { Timeline, TimelineEvent, TimelineBlip } from 'react-event-timeline';
import { Container, Card, CardText, CardTitle, CardSubtitle, CardBody, CardImg, CardFooter } from 'reactstrap';
import './style.css';
import ScrollableAnchor from 'react-scrollable-anchor';


class Experience extends Component {
  render() {
    return (
      <ScrollableAnchor id={'Experience'}>
        <div>
          <Container fluid={true} className="experience-wrapper">
            <h3>EXPERIENCE</h3>
              <Timeline lineColor="#e7cd24" className="custom-line-xp">
                <TimelineEvent className="custom-xp-event mb-5"
                  title="2012 - 2018 : Reponsable Grands Comptes"
                  container="card"
                  titleStyle={{fontWeight: "bold"}}
                  style={{boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"}}
                  cardHeaderStyle={{backgroundColor: "#e7cd24", color:"whitesmoke", border:"1px solid e7cd24"}}
                  iconColor="#e7cd24"
                  icon={<i class="fa fa-rocket"></i>}
                  bubbleStyle={{backgroundColor: "white", margin:"2px"}}>
                  <div>
                    <Card className="custom-xp-card">
                      <CardBody className="card-xp-body-custom pb-1">
                        <CardTitle className="card-custom-title">IMIE, Ecole de la filière numérique <span className="custom-xp-city">(Nantes)</span></CardTitle>
                          <hr></hr>
                          <CardSubtitle className="custom-subtitle mb-3 mt-4">2017 - 2018 : Responsable Grands comptes</CardSubtitle>
                            <CardText><p>Accompagnement dans la GPEC</p>
                              <p>Gestion des plans de recrutements et de formation dédiées</p>
                              <p>Placement des candidats</p>
                            </CardText>
                            <CardSubtitle className="custom-subtitle mb-3 mt-4">2013 - 2016 : Relations entreprises</CardSubtitle>
                              <CardText>
                                <p>Placement et suivi des candidats</p>
                                <p>Veille sur les besoins du bassin d'emploi</p>
                                <p>Promotion de l'école</p>
                              </CardText>
                            <CardSubtitle className="custom-subtitle mb-3 mt-4">2012 - 2013 : Talent manager</CardSubtitle>
                              <CardText>
                                <p>Identification et traîtement des candidatures</p>
                                <p>Suivi des alternants et stagiaires</p>
                                <p>Animation des modules de formation</p>
                              </CardText>
                        </CardBody>
                      </Card>
                    </div>
                  </TimelineEvent>
                  <TimelineEvent
                      className="mb-5" title="2010 - 2011 : Responsable commercial"
                      container="card"
                      titleStyle={{fontWeight: "bold"}}
                      style={{boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"}}
                      cardHeaderStyle={{backgroundColor: "#e7cd24", color:"whitesmoke", border:"1px solid e7cd24"}}
                      iconColor="#e7cd24"
                      icon={<i class="fa fa-rocket"></i>}
                      bubbleStyle={{backgroundColor: "white", margin:"2px"}}>
                  <div>
                    <Card className="custom-xp-card">
                      <CardBody className="card-xp-body-custom pb-1">
                        <CardTitle className="card-custom-title">Image Webdesign <span className="custom-xp-city">(Guérande)</span></CardTitle>
                          <hr></hr>
                          <CardText>
                            <p>Négociation des partenariats et des contrats</p>
                            <p>Prospection et création d'un portefeuille client</p>
                            <p>Suivi des projets</p>
                          </CardText>      
                        </CardBody>
                      </Card>
                  </div>
                </TimelineEvent>
                <TimelineEvent
                  title="2006 - 2010 : Directeur clientèle"
                  container="card"
                  titleStyle={{fontWeight: "bold"}}
                  style={{boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"}}
                  cardHeaderStyle={{backgroundColor: "#e7cd24", color:"whitesmoke", border:"1px solid e7cd24"}}
                  iconColor="#e7cd24"
                  icon={<i class="fa fa-rocket"></i>}
                  bubbleStyle={{backgroundColor: "white", margin:"2px"}}>
                <div>
                  <Card className="custom-xp-card">
                    <CardBody className="card-xp-body-custom pb-1">
                      <CardTitle className="card-custom-title">Groupe Piana <span className="custom-xp-city">(Paris)</span></CardTitle>
                        <hr></hr>
                        <CardSubtitle className="custom-subtitle mb-3 mt-4">2007 - 2010 : Directeur clientèle</CardSubtitle>
                          <CardText>
                            <p>Financement informatique B to B</p>
                            <p>Intermédiation bancaire</p>
                            <p>Gestion des contentieux administratifs</p>
                          </CardText>
                        <CardSubtitle className="custom-subtitle mb-3 mt-4">2005 - 2007 : Chargé de clientèle</CardSubtitle>
                          <CardText>
                            <p>Financement informatique B to C</p>
                            <p>Prospection et création d'un portefeuille client</p>
                            <p>Négociation des contrats</p>
                          </CardText>
                      </CardBody>
                    </Card>
                  </div>
      </TimelineEvent>
    </Timeline>
  </Container>
  </div>
</ScrollableAnchor>
    );
  }
}


export default Experience;