import React, { Component } from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export default class Platform extends Component {
    constructor(props) {
        super(props);

        this.unityContent = new UnityContent(
            "build/Build.json",
            "build/UnityLoader.js"
        );
    }

    render() {
        return <Unity unityContent={this.unityContent} />;
    }
}
