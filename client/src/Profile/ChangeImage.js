import React, { Component } from "react";
import "./ChangeImage.css";
import axios from "axios";

const DEFAULT_IMG =
	"https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/user.png";

export default class ChangeImage extends Component {
	state = {
		url: "",
		img: ""
	};

	componentDidMount() {
		this.setState({ img: this.props.img });
		this.loadImage();
	}

	changeImage() {
		axios
			.put("/Profile/image", {
				url: this.state.url
			})
			.then(() => {
				this.setState({ url: "" });
				this.loadImage();
			});
	}

	loadImage() {
		axios.get("/Profile/data").then(res => {
			this.setState({
				img: res.data.image
			});
		});
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col changeImage">
						<h2>Changer ma photo de profil</h2>
						<input
							type="text"
							className="form-control"
							placeholder="URL"
							value={this.state.url}
							onChange={e => this.setState({ url: e.target.value })}
						/>
						<button
							type="submit"
							className="btn btn-outline-primary ml-2"
							onClick={() => this.changeImage()}>
							Envoyer
						</button>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<div className="user-data">
							<img
								className="user-img"
								src={this.state.img ? this.state.img : DEFAULT_IMG}
								alt="Profile"
							/>
							<h1>{this.props.username}</h1>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
