import React, { Component, PropTypes } from "react";
import {TweenMax} from "gsap";
// import ReactPIXI  from 'react-pixi';
import "./style.css";
import PIXI from 'pixi.js';

const WINDOW = { 
	width: window.innerWidth,
	height: window.innerHeight
}

export default class BackgroundAni extends Component {
	/**
	* Define our prop types
	**/
    static propTypes = {
        zoomLevel: PropTypes.number
    };
	
	constructor(props) {
		super(props);

		//bind our animate function
		this.animate = this.animate.bind(this);
		//bind our zoom function
		this.updateZoomLevel = this.updateZoomLevel.bind(this);
	}

	componentDidMount() {

		//Setup PIXI Canvas in componentDidMount
		this.renderer = PIXI.autoDetectRenderer(WINDOW.width, WINDOW.height);
		this.refs.gameCanvas.appendChild(this.renderer.view);
		
		// create the root of the scene graph
		this.stage = new PIXI.Container();
		this.stage.width = WINDOW.width;
		this.stage.height = WINDOW.height;
		
		// Create shapes
		this.bar = this.drawShape();
		this.bar.x = 700;
		this.bar.y = 200;
		this.bar.anchor = 0.5;
		this.stage.addChild(this.bar);
		//start the game
		this.animate();
	}

	drawShape() {
		const bar = new PIXI.Graphics();

		bar.beginFill(0x00ff87);
		bar.lineStyle(0, 0xffd900, 0);

		bar.drawRect(-100, -10, 200, 20);
		bar.endFill();

		return bar;
	}

	animate() {
		// render the stage container
		this.renderer.render(this.stage);
		this.frame = requestAnimationFrame(this.animate);
		console.log('pixi tick');

		this.bar.rotation += 0.05
	}


	shouldComponentUpdate(nextProps, nextState) {
		//this is easy with 1 prop, using Immutable helpers make 
		//this easier to scale
		
		return nextProps.zoomLevel !== this.props.zoomLevel;
	}

	componentWillReceiveProps(nextProps) {
		this.updateZoomLevel(nextProps);
	}
	
	/**
	* Update the stage "zoom" level by setting the scale
	**/
	updateZoomLevel(props) {
		this.stage.scale.x = props.zoomLevel;
		this.stage.scale.y = props.zoomLevel;
	}
	
	/**
	* Render our container that will store our PixiJS game canvas. Store the ref
	**/
	render() {
		return (
			<div className="game-canvas-container" ref="gameCanvas" />
		);
	}
}