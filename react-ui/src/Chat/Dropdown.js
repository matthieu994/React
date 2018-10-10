import React, { Component } from "react";
import "./Dropdown.css";

export default class Dropdown extends Component {
	componentDidMount() {
		window.addEventListener("click", () => this.closeMenu());
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.closeMenu);
	}

	closeMenu(e) {
		if (this.dropdown && this.dropdown.classList.contains("show"))
			this.dropdown.classList.remove("show");
		document.querySelectorAll(".dropdown-content").forEach(el => {
			el.classList.remove("show");
		});
	}

	toggleMenu(e) {
		if (!this.dropdown) this.dropdown = e.target.closest(".dots").nextSibling;

		e.preventDefault();
		e.stopPropagation();
		document.querySelectorAll(".dropdown-content").forEach(el => {
            el !== this.dropdown && el.classList.remove("show");
		});
        this.dropdown.classList.toggle("show");
    }
    
    deleteConversation() {
		this.props.socket.emit("deleteConversation", this.props.id);
    }

	render() {
		return (
			<div className="custom-dropdown">
				<div className="dots" onClick={e => this.toggleMenu(e)}>
					<span className="dot" />
					<span className="dot" />
					<span className="dot" />
				</div>
				<div id="myDropdown" className="dropdown-content">
					<span onClick={() => this.deleteConversation()}>Supprimer</span>
				</div>
			</div>
		);
	}
}
