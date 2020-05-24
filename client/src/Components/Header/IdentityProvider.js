import { Component } from "react";
import axios from "axios";

export default class IdentityProvider extends Component {
    constructor() {
        super();
        axios.defaults.baseURL = document.location.origin + "/api";

        axios.interceptors.request.use(
            (request) => {
                // Edit request config
                request.headers["Authorization"] = localStorage.getItem("token");
                // console.log(request.headers, request);
                return request;
            },
            (error) => {
                console.log(error);
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => {
                // console.log(response);
                // Edit response config
                return response;
            },
            (error) => {
                console.log(error);
                return Promise.reject(error);
            }
        );
    }
    render() {
        return null;
    }
}
