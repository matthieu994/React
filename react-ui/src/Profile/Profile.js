import React, { Component } from "react";
import axios from "axios";
import "./Profile.css";
import ChangeImage from "./ChangeImage";
import { DEFAULT_IMG } from "../Const/const";

export default class Profile extends Component {
	state = {
		friends: [],
		users: [],
		img: "",
		searchInput: "",

		popUp: false,
		sendTo: "",
		elToSend: "todo",
		elements: []
	};

	componentDidMount() {
		this.getData();
		axios.defaults.headers.common["token"] = localStorage.getItem("token");
	}

	getHeaders() {
		return {
			headers: {
				token: localStorage.getItem("token")
			}
		};
	}

	getData() {
		axios
			.get("/Profile/data", this.getHeaders())
			.then(res => {
				this.getFriends();
				this.setState({
					username: res.data.username,
					img: res.data.image
				});
				this.loadTodos();
			})
			.catch(err => console.log(err));
	}

	getFriends() {
		axios
			.get("/Profile/friends", this.getHeaders())
			.then(res => {
				res.data.sort(function(a, b) {
					return a._id > b._id ? 1 : b._id > a._id ? -1 : 0;
				});
				this.setState({
					friends: res.data
				});
			})
			.catch(err => console.log(err));
	}

	getUsers(value) {
		axios
			.post(
				"/Profile/users",
				{
					startingWith: value
				},
				this.getHeaders()
			)
			.then(res => {
				this.setState({
					users: res.data
				});
			})
			.catch(err => console.log(err));
	}

	addFriend(username) {
		axios
			.post(
				"/Profile/friend",
				{
					username: username
				},
				this.getHeaders()
			)
			.then(res => {
				this.getFriends();
			})
			.catch(err => console.log(err));
	}

	acceptFriend(username) {
		axios
			.put(
				"/Profile/friend",
				{
					username: username
				},
				this.getHeaders()
			)
			.then(res => {
				this.getFriends();
			})
			.catch(err => console.log(err));
	}

	removeFriend(username) {
		axios
			.delete("/Profile/friend", {
				data: {
					username: username
				},
				headers: {
					token: localStorage.getItem("token")
				}
			})
			.then(res => {
				this.getFriends();
				this.getUsers();
			})
			.catch(err => console.log(err));
	}

	handleSearch(e) {
		this.setState({
			searchInput: e.target.value
		});
		this.getUsers(e.target.value);
	}

	renderUsers() {
		return this.state.users.map((user, index) => {
			if (user.username === this.state.username) return null;

			this.state.friends.map(friend => {
				if (friend._id === user.username) user.username = undefined;
				return null;
			});
			if (!user.username) return null;

			return (
				<div
					className="list-group-item list-group-item-action list-group-item-info"
					key={index}>
					{user.username}
					<i
						className="fas fa-user-plus btn float-right"
						onClick={this.addFriend.bind(this, user.username)}
					/>
				</div>
			);
		});
	}

	renderFriends() {
		if (this.state.friends.length < 1) {
			return <p>Ajoutez des amis !</p>;
		}
		return this.state.friends.map((friend, index) => {
			let removeText = "Annuler";
			if (friend.status === "OK") removeText = "Supprimer";
			if (friend.status === "REQUEST") removeText = "Refuser";
			return (
				<div className={"user-card " + friend.status} key={index}>
					<img
						className="user-img"
						src={friend.url ? friend.url : DEFAULT_IMG}
						alt="Profile"
					/>
					<div className="user-name">
						<h5>{friend._id}</h5>
						{friend.status === "PENDING" && <p>En attente</p>}
					</div>
					{friend.status === "OK" && (
						<button
							className="btn btn-outline-primary share"
							onClick={() => this.setState({ popUp: true, sendTo: friend._id })}>
							Partager
							<i className="fas fa-share-square" />
						</button>
					)}
					<div className="user-status">
						{friend.status === "REQUEST" && (
							<button
								type="button"
								className="btn btn-success"
								onClick={this.acceptFriend.bind(this, friend._id)}>
								Accepter
							</button>
						)}
						<a
							className="removeFriend"
							onClick={this.removeFriend.bind(this, friend._id)}>
							{removeText}
						</a>
					</div>
				</div>
			);
		});
	}

	hidePopup(event) {
		if (event.target.className !== "popup") return;
		this.setState({ popUp: false, sendTo: "" });
	}

	handleSelect(event) {
		this.setState({ elToSend: event.target.value });
		if (event.target.value === "todo") this.loadTodos();
	}

	loadTodos() {
		axios.get("/todos").then(res => {
			this.setState({ elements: res.data });
		});
	}

	sendTodo(id) {
		axios
			.post("/share", {
				todo: id,
				friend: this.state.sendTo
			})
			.then(res => {
				this.setState({ elements: res.data });
			});
	}

	renderTodos() {
		return this.state.elements.map((item, index) => {
			if (!item) return null;
			return (
				<div
					className={
						item.done
							? "list-group-item disabled pt-3"
							: "list-group-item pt-3 list-group-item-action list-group-item-info"
					}
					key={item._id}>
					{item.done ? <del> {item.text} </del> : item.text}
					<i className="fas fa-share-square" onClick={() => this.sendTodo(item._id)} />
				</div>
			);
		});
	}

	renderPopup() {
		return (
			<div className="popup" onClick={e => this.hidePopup(e)}>
				<div>
					Envoyer
					<select onChange={e => this.handleSelect(e)}>
						<option value="todo">un Todo</option>
						<option value="test">un Test</option>
					</select>
					à <h2>{this.state.sendTo}</h2>
					<div className="list-group">
						{this.state.elToSend === "todo" && this.renderTodos()}
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="container">
				{this.state.popUp && this.renderPopup()}
				<ChangeImage username={this.state.username} img={this.state.img} />
				<div className="row">
					<div className="col">
						<input
							value={this.state.searchInput}
							className="search"
							placeholder="Ajoutez un ami..."
							onChange={this.handleSearch.bind(this)}
							onFocus={this.handleSearch.bind(this)}
						/>
						<i
							className="fas fa-times btn delete-search"
							onClick={() => {
								this.setState({ users: [] }) && this.renderUsers();
							}}
						/>
					</div>
				</div>
				<div className="users">{this.renderUsers()}</div>
				<div className="row friends">
					<h1>Mes amis</h1>
					{this.renderFriends()}
				</div>
			</div>
		);
	}
}
