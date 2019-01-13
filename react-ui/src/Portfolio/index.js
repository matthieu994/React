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
		let target = e.target;
		let width = e.target.nextSibling.clientWidth / 2;
		target.style.transform = "translateX(-" + (width + 30) + "px)";

		target.nextSibling.style.transform = "translateX(-" + (width + 30) + "px)";
		target.nextSibling.style.opacity = "1";
		target.nextSibling.style.display = "initial";
	}

	hideLink(e) {
		let target = e.target;
		target = target.closest(".link");
		target.childNodes[0].style.transform = "unset";

		target.childNodes[1].style.transform = "unset";
		target.childNodes[1].style.opacity = "0";
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
