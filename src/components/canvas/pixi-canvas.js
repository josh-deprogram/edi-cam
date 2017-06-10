import React, { Component, PropTypes } from "react";
import {TweenMax} from "gsap";
// import ReactPIXI  from 'react-pixi';
import "./style.css";
// import PIXI from 'pixi.js';

const SCREEN = { 
	width: window.innerWidth,
	height: window.innerHeight
}
const PARTICLES = 30;

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
		this.barContainer = [];

		window.addEventListener('resize', this.onResize.bind(this), true);
	}

	componentDidMount() {

		//Setup PIXI Canvas in componentDidMount
		this.renderer = PIXI.autoDetectRenderer(SCREEN.width, SCREEN.height, {antialias: true, transparent: true, resolution: 1});
		this.refs.gameCanvas.appendChild(this.renderer.view);
		
		// create the root of the scene graph
		this.stage = new PIXI.Container();
		this.stage.width = SCREEN.width;
		this.stage.height = SCREEN.height;
		
		// Create shapes
		for (let i = 0; i < PARTICLES; i++) {
			const bar = this.drawShape();
			bar.x = Math.random() * SCREEN.width;
			bar.y = Math.random() * SCREEN.height;
			bar.scale.x = bar.scale.y = Math.random() + 0.2;
			bar.rotation = Math.random();
			this.barContainer.push(bar);
			this.stage.addChild(bar);
		}

		//start the game
		this.animate();
	}

	drawShape() {
		const bar = new PIXI.Graphics();

		bar.beginFill(0x00ff87);
		bar.lineStyle(0, 0xffd900, 0);

		bar.drawRect(-50, -5, 100, 10);
		bar.rotationSet = Math.random() * 0.03;
		// console.log(bar.rotation )
		bar.endFill();

		return bar;
	}

	rotateBar() {
		for (let i = 0; i < PARTICLES; i++) {
			this.barContainer[i].rotation += this.barContainer[i].rotationSet;
		}
	}

	animate() {
		// render the stage container
		this.renderer.render(this.stage);
		this.frame = requestAnimationFrame(this.animate);
		console.log('pixi tick');

		this.rotateBar();
	}


	// shouldComponentUpdate(nextProps, nextState) {
	// 	//this is easy with 1 prop, using Immutable helpers make 
	// 	//this easier to scale
		
	// 	return nextProps.zoomLevel !== this.props.zoomLevel;
	// }

	componentWillReceiveProps(nextProps) {

	}
	
	// On Window Resize.
	onResize() {
		this.renderer.width = SCREEN.width + "px";;
		this.renderer.height = SCREEN.height + "px";;
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