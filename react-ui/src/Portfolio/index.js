import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import "./portfolio.css";
import profile from "./images/cv_profile.jpg";
import githubIcon from "./images/github.svg";
import linkedinIcon from "./images/linkedin.png";
import websiteIcon from "./images/website.svg";
import telIcon from "./images/tel.png";
import mailIcon from "./images/mail.svg";

export default class Portfolio extends Component {
	render() {
		return (
			<MDBContainer className="portfolio" fluid>
				<MDBRow>
					<Links />
					<MDBCol size="9" />
				</MDBRow>
			</MDBContainer>
		);
	}
}

class Links extends Component {
	showLink(e) {
		e.target.style.animation = "slideleft 0.5s";
		e.target.nextSibling.style.animation = "fadein 0.5s";
		e.target.nextSibling.style.display = "initial";
	}

	hideLink(e) {
		e.target = e.target.closest(".link");
		e.target.childNodes[0].style.animation = "slideright 0.5s";
		e.target.childNodes[1].style.animation = "fadeout 0.5s";
		setTimeout(
			function() {
				this.childNodes[1].style.display = "none";
			}.bind(e.target),
			500
		);
	}

	render() {
		return (
			<MDBCol size="3" layout="profile">
				<img src={profile} alt="profile" />
				<div className="link" onMouseLeave={e => this.hideLink(e)}>
					<img src={telIcon} alt="tel" onMouseEnter={e => this.showLink(e)} />
					<span>+33 7 67 32 97 86</span>
				</div>
				<div className="link" onMouseLeave={e => this.hideLink(e)}>
					<img src={mailIcon} alt="mail" onMouseEnter={e => this.showLink(e)} />
					<a
						rel="noopener noreferrer"
						href="mailto:matthieu-petit@laposte.net"
						target="_blank">
						matthieu-petit@laposte.net
					</a>
				</div>
				<div className="link" onMouseLeave={e => this.hideLink(e)}>
					<img src={githubIcon} alt="github" onMouseEnter={e => this.showLink(e)} />
					<a
						rel="noopener noreferrer"
						href="https://github.com/matthieu994"
						target="_blank">
						GitHub
					</a>
				</div>
				<div className="link" onMouseLeave={e => this.hideLink(e)}>
					<img src={linkedinIcon} alt="linkedin" onMouseEnter={e => this.showLink(e)} />
					<a
						rel="noopener noreferrer"
						href="https://linkedin.com/in/matthieu994"
						target="_blank">
						LinkedIn
					</a>
				</div>
				<div className="link" onMouseLeave={e => this.hideLink(e)}>
					<img src={websiteIcon} alt="website" onMouseEnter={e => this.showLink(e)} />
					<a rel="noopener noreferrer" href="/" target="_blank">
						Site personnel
					</a>
				</div>
			</MDBCol>
		);
	}
}
