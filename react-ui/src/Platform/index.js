import React, { Component } from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import "./platform.css"

export default class Platform extends Component {
    constructor(props) {
        super(props);

        this.unityContent = new UnityContent(
            "Platform/Build/TemplateData.json",
            "Platform/Build/UnityLoader.js"
        );
    }

    componentWillUnmount() {
        this.unityContent.Quit();
    }

    render() {
        return <Unity unityContent={this.unityContent} className="platform" />;
    }
}
