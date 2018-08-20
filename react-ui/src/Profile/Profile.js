import React, { Component } from 'react';
import axios from 'axios';
import './Profile.css'

export default class Profile extends Component {
    state = {
        username: '',
        friends: [],
        users: [],
        searchInput: ''
    }

    componentDidMount() {
        this.getUsername()
        this.getFriends()
    }

    getHeaders() {
        return ({
            headers: {
                token: localStorage.getItem('token')
            }
        })
    }

    getUsername() {
        axios.get('/Profile/username', this.getHeaders()
        ).then((res) => {
            this.setState({
                username: res.data
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
        axios.post('/Profile/addFriend', {
            username: username
        }, this.getHeaders()).then((res) => {
            this.getFriends()
        }).catch(err => console.log(err))
    }

    acceptFriend(username) {
        axios.post('/Profile/acceptFriend', {
            username: username
        }, {
                headers: {
                    token: localStorage.getItem('token')
                }
            }).then((res) => {
                this.getFriends()
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
            let removeText = "ANNULER";
            if (friend.status === "OK") removeText = "Supprimer"
            if (friend.status === "REQUEST") removeText = "Refuser"
            return (
                <div className="user-card" key={index}>
                    <img className="user-img" src='https://connect2id.com/assets/learn/openid-connect/userinfo.png' alt="Profile" />
                    <span className="user-name">{friend._id}</span>
                    <div className="user-status">
                        {friend.status === "PENDING" &&
                            <span className="card-text">En attente</span>
                        }
                        {friend.status === "OK" &&
                            <i className="fas fa-check"></i>
                        }
                        {friend.status === "REQUEST" &&
                            <button type="button" className="btn btn-success"
                                onClick={this.acceptFriend.bind(this, friend._id)}>Accepter</button>
                        }
                        <button className="btn removeFriend">{removeText}</button>
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