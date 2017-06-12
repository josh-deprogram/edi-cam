import React, { Component, PropTypes } from "react";
import "./style.css";

export default class Video extends Component {

    static propTypes = {
        // zoomLevel: PropTypes.number
    };
	
	constructor(props) {
		super(props);
	}

	componentDidMount() {
        const video = document.getElementById('video');
        video.setAttribute('crossorigin', 'anonymous');
	}

	render() {
		return (
        <video src='http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4'
            muted
            autoPlay
            loop
            controls={false}
            id='video'
        >

        </video>);
	}
}