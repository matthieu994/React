import React, { Component } from 'react';
import axios from 'axios';

export default class Profile extends Component {
    state = {
        friends: [],
        users: [],
        searchInput: ''
    }

    constructor() {
        super()
        this.getFriends()
    }

    getFriends() {
        axios.get('/Profile/friends', {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((res) => {
            this.setState({
                friends: res.data.friends
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

    render() {
        console.log(this.state.users)
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <input
                            value={this.state.searchInput}
                            className="search"
                            placeholder="Ajoutez un ami..."
                            onChange={this.handleSearch.bind(this)}
                            onFocus={this.handleSearch.bind(this)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}