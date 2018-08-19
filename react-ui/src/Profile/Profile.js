import React, { Component } from 'react';
import axios from 'axios';
import { UserIcon } from '../Applications/Applications';
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

    getUsername() {
        axios.get('/Profile/username', {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((res) => {
            this.setState({
                username: res.data
            })
        }).catch(err => console.log(err))
    }

    getFriends() {
        axios.get('/Profile/friends', {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((res) => {
            this.setState({
                friends: res.data
            })
        }).catch(err => console.log(err))
    }

    getUsers(value) {
        axios.post('/Profile/users', {
            startingWith: value
        }, {
                headers: {
                    token: localStorage.getItem('token')
                }
            }).then((res) => {
                this.setState({
                    users: res.data
                })
            }).catch(err => console.log(err))
    }

    handleSearch(e) {
        this.setState({
            searchInput: e.target.value
        })
        this.getUsers(e.target.value);
    }

    addFriend(username) {
        axios.post('/Profile/addFriend', {
            username: username
        }, {
                headers: {
                    token: localStorage.getItem('token')
                }
            }).then((res) => {
                this.getFriends()
            }).catch(err => console.log(err))
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
            return (
                <div className="list-group-item list-group-item-action list-group-item-info" key={index}>
                    {friend._id}
                </div>
            )
        })
    }

    render() {
        return (
            <div className="container">
                <UserIcon />
                <div className="row">
                    <div className="col">
                        <input
                            value={this.state.searchInput}
                            className="search"
                            placeholder="Ajoutez un ami..."
                            onChange={this.handleSearch.bind(this)}
                            onFocus={this.handleSearch.bind(this)}
                        />
                        <i className="fas fa-times btn"
                            onClick={() => this.setState({ users: [] })}
                        ></i>
                    </div>
                </div>
                <div className="list-group users">
                    {this.renderUsers()}
                </div>
                <div className="list-group friends">
                    <h1>
                        Mes amis
                    </h1>
                    {this.renderFriends()}
                </div>
            </div>
        )
    }
}