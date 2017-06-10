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

	}

	render() {
		return (<video>

        </video>);
	}
}