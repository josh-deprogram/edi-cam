import React, { Component } from "react";
import {TweenMax} from "gsap";
import pixi from 'pixi.js';
import "./style.css";

const WINDOW = { 
	width: window.innerWidth,
	height: window.innerHeight
}
// Reference Pixi on the WINDOW
const PIXI = window.PIXI;

export default class BackgroundAni extends Component {
	
	/**
	* Define our prop types
	**/
    static propTypes = {
        // zoomLevel: PropTypes.number
    };
	
	constructor(props) {
		super(props);

		//bind our animate function
		this.animate = this.animate.bind(this);
	}

	componentDidMount() {
		setTimeout(()=>{
			console.log(window.PIXI)
			
			//Setup PIXI Canvas in componentDidMount
			this.renderer = PIXI.autoDetectRenderer(WINDOW.width, WINDOW.height, { transparent: true });
			this.refs.gameCanvas.appendChild(this.renderer.view);
			
			// create the root of the scene graph
			this.stage = new PIXI.Container();
			this.stage.width = WINDOW.width;
			this.stage.height = WINDOW.height;
			
			// Create the Video Sprtie
			this.getVideoTexture();

			// Create shapes
			this.bar = this.drawShape();
			this.bar.x = WINDOW.width/2;
			this.bar.y = WINDOW.height/2;
			this.bar.anchor = 0.5;
			this.stage.addChild(this.bar);

			//start the game
			this.animate();

		}, 20);
	}

	getVideoTexture() {
		// Get Video element.
		const vidEl = document.getElementById('video');
		// Get Video Texture
		// create a video texture from a path
		//Texture.fromVideoUrl('..url to video...');// Or if you have a video element already:var videoTexture = Texture.fromVideo(videoElement);
		const videoTexture = PIXI.Texture.fromVideo(vidEl);
		this.videoSprite = new PIXI.Sprite(videoTexture);
		// this.videoSprite.anchor = 0.5;
		// this.videoSprite.x = WINDOW.width/2;
		// this.videoSprite.y = WINDOW.height/2;
		this.videoSprite.width =  WINDOW.width;
		this.videoSprite.height =  WINDOW.height;

		this.stage.addChild(this.videoSprite);
	}

	blurVideo(){
		const blurFilter1 = new PIXI.filters.BlurFilter();
		blurFilter1.blur = 60;
		this.videoSprite.filters = [blurFilter1];
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

		// console.log('pixi tick');
		// this.videoSprite.rotation += 0.1;
		this.bar.rotation += 0.13;
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