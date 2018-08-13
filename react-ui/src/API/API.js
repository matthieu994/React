import React, { Component } from 'react';

class API extends Component {
    componentDidMount() {
        fetch('/')
            .then(function (response) {
                return response.json();
            })
            .then(function (resp) {
                console.log(resp);
            });
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default API;
