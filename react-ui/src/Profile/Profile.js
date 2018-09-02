import React, { Component } from 'react';
import axios from 'axios';
import './Profile.css'

export default class Profile extends Component {
    state = {
        friends: [],
        users: [],
        searchInput: ''
    }

    componentDidMount() {
        this.getData()
    }

    getHeaders() {
        return ({
            headers: {
                token: localStorage.getItem('token')
            }
        })
    }

    getData() {
        axios.get('/Profile', this.getHeaders()
        ).then((res) => {
            this.getFriends();
            this.setState({
                username: res.data.username,
                img: res.data.img
            })
        }).catch(err => console.log(err))
    }

    getFriends() {
        axios.get('/Profile/friends', this.getHeaders()
        ).then((res) => {
            this.setState({
                friends: res.data
            })
        }).catch(err => console.log(err))
    }

    getUsers(value) {
        axios.post('/Profile/users', {
            startingWith: value
        }, this.getHeaders()).then((res) => {
            this.setState({
                users: res.data
            })
        }).catch(err => console.log(err))
    }

    addFriend(username) {
        axios.post('/Profile/friend', {
            username: username
        }, this.getHeaders()).then((res) => {
            this.getFriends()
        }).catch(err => console.log(err))
    }

    acceptFriend(username) {
        axios.put('/Profile/friend', {
            username: username
        }, this.getHeaders()).then((res) => {
            this.getFriends()
        }).catch(err => console.log(err))
    }

    removeFriend(username) {
        axios.delete('/Profile/friend', {
            data: {
                username: username
            },
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((res) => {
            this.getFriends()
            this.getUsers()
        }).catch(err => console.log(err))
    }

    handleSearch(e) {
        this.setState({
            searchInput: e.target.value
        })
        this.getUsers(e.target.value);
    }

    renderUsers() {
        return this.state.users.map((user, index) => {
            if (user.username === this.state.username) return null;

            this.state.friends.map(friend => {
                if (friend._id === user.username) user.username = undefined;
                return null;
            })
            if (!user.username) return null;

            return (
                <div className="list-group-item list-group-item-action list-group-item-info" key={index}>
                    {user.username}
                    <i
                        className="fas fa-user-plus btn float-right"
                        onClick={this.addFriend.bind(this, user.username)}
                    ></i>
                </div>
            )
        })
    }

    renderFriends() {
        return this.state.friends.map((friend, index) => {
            let removeText = "Annuler";
            if (friend.status === "OK") removeText = "Supprimer"
            if (friend.status === "REQUEST") removeText = "Refuser"
            return (
                <div className={"user-card " + friend.status} key={index}>
                    <img className="user-img" src={friend.url ? friend.url : "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/user.png"} alt="Profile" />
                    <div className="user-name">
                        <h5>{friend._id}</h5>
                        {friend.status === "PENDING" &&
                            <div className="loader"></div>}
                    </div>
                    {friend.status === "OK" &&
                        <span>
                            Partager
                        </span>}
                    <div className="user-status">
                        {friend.status === "REQUEST" &&
                            <button type="button" className="btn btn-success"
                                onClick={this.acceptFriend.bind(this, friend._id)}>Accepter</button>
                        }
                        <a className="removeFriend" onClick={this.removeFriend.bind(this, friend._id)}>{removeText}</a>
                    </div>
                </div>
            )
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>{this.state.username}</h1>
                        <img className="user-img" src={this.state.img ? this.state.img : "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/user.png"} alt="Profile" />
                        <input
                            value={this.state.searchInput}
                            className="search"
                            placeholder="Ajoutez un ami..."
                            onChange={this.handleSearch.bind(this)}
                            onFocus={this.handleSearch.bind(this)}
                        />
                        <i className="fas fa-times btn delete-search"
                            onClick={() => { this.setState({ users: [] }) && this.renderUsers() }}
                        ></i>
                    </div>
                </div>
                <div className="users">
                    {this.renderUsers()}
                </div>
                <div className="friends wrapper">
                    <h1>
                        Mes amis
                    </h1>
                    {this.renderFriends()}
                </div>
            </div>
        )
    }
}