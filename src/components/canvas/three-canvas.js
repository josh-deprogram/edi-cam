import React, { Component } from "react";
import {TweenMax} from "gsap";
import * as THREE from 'three';

// DEFINE GLOBALLY SO CAN USE ON MAP.
window.THREE = THREE;

import "./style.css";

let scope;

export default class ThreeCanvas extends Component {

	constructor(props, context) {
		super(props, context);
		
        this.renderer = null;
        this.camera   = null;
        this.scene    = null;
        this.counter  = 0;
        this.gui      = null;
        this.clock    = new THREE.Clock();
        this.DEBUG    = true;
        this.SIZE     = {
            w  : window.innerWidth ,
            w2 : window.innerWidth / 2,
            h  : window.innerHeight,
            h2 : window.innerHeight / 2
        };

        scope = this;
	}

    init() {

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0x7a4bff, 0.005 );
 
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        
        this.camera.position.z = 800;
        this.camera.position.y = 700;

        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.refs.canvas.appendChild( this.renderer.domElement );
        this.camera.lookAt( new THREE.Vector3(0,0,0) );

        scope.createScene();
        scope.createLights();
        scope.animate();
        
        if(scope.refs.canvas.style.opacity === '0')
                    TweenMax.to(scope.refs.canvas, 1, {alpha:1, delay:.5});
        // Event Listeners
        window.addEventListener("mousemove", this.onMouseMove, false );

        // window.addEventListener("mousedown", this.onMouseDown, false );
        // window.addEventListener("mouseup", this.onMouseUp, false );

        // window.addEventListener( 'touchstart', this.onTouchStart, false );
        // window.addEventListener( 'touchend', this.onTouchEnd, false );

        window.addEventListener( 'touchmove', this.onTouchMove, false );
    }

    createLights() {
        const directionalLight = new THREE.DirectionalLight( 0xffeedd );
        // directionalLight.position.set( 2.3, .4, 1 );
        // this.scene.add( directionalLight );

        var directionalLight2 = new THREE.DirectionalLight( 0xfff600);
        directionalLight2.position.set( 0, 700, 0 );
        // this.scene.add( directionalLight2 );
        directionalLight.castShadow = true;

        // this.hemLight = new THREE.HemisphereLight(0x3cdbfd, 0x252525, 1);
        // this.scene.add(this.hemLight)

        this.spotlight = new THREE.SpotLight( 0x00ff87, 2 );
        this.spotlight.position.set( 0, 1600, 900 );
        this.spotlight.castShadow = true;
        this.scene.add(this.spotlight)
    }

    createScene() {
        this.watchgroup = new THREE.Group();

        const worldWidth = 55, worldDepth = 15,
        worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
        const clock = new THREE.Clock();

        this.floorgeometry = new THREE.PlaneGeometry( 2500, 1500, worldWidth - 1, worldDepth - 1 );
        this.floorgeometry.rotateX( - Math.PI / 2 );
        for ( var i = 0, l = this.floorgeometry.vertices.length; i < l; i ++ ) {
            this.floorgeometry.vertices[ i ].y = 35 * Math.sin( i / 2 );
        }

        const texture = new THREE.TextureLoader().load( "img/pattern_1.jpg" );
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 15, 15 );

        const material = new THREE.MeshPhongMaterial( { 
            color: 0xffffff, 
            specular: 0x00ff87,
            shininess: 35,
            map: texture 
        });
        
        const material2 = new THREE.MeshBasicMaterial( { 
            color: 0x00ff87, 
            // morphTargets: true,
            wireframe: true
        } );

        this.floormesh = new THREE.Mesh( this.floorgeometry, material );
        this.floormesh.position.z = 50;
        this.floormesh.scale.x = 0;
        TweenMax.to(this.floormesh.scale, 0, {x:1, delay:.3});

        this.floormesh2 = new THREE.Mesh( this.floorgeometry, material2 );
        this.floormesh2.position.z = 50;
        this.floormesh2.position.y = 10;
        // this.floormesh2.cale.x = 0;

        this.scene.add( this.floormesh );
        this.scene.add( this.floormesh2 );

        // this.mouseX = 100;
        // this.mouseZ = 700;

        this.floor = { 
            height: 25, 
            speed: 9 }
    }

    animate(){
        
        requestAnimationFrame( scope.animate );
 
        // mesh.rotation.x += 0.01;
        // mesh.rotation.y += 0.02;
        // console.log('tick');

        let el = scope.clock.getElapsedTime() * .105;
        let d = scope.clock.getDelta();

        scope.renderer.clear();

        // Update Floor
        var delta = scope.clock.getDelta(),
            time = scope.clock.getElapsedTime() * 6;
        
        for ( var i = 0, l = scope.floorgeometry.vertices.length; i < l; i ++ ) {
            scope.floorgeometry.vertices[ i ].y = scope.floor.height * Math.sin( i / 2 + ( time + i ) / scope.floor.speed );
        }
        
        scope.floormesh.geometry.verticesNeedUpdate = true;
        scope.floormesh2.geometry.verticesNeedUpdate = true;

        // Update Camera
        let touchoffset = 0;
        let touchoffsetx = 0;
        let touchoffsety = 0
        TweenMax.to(scope.camera.position, 0.8, {
            x:( scope.mouseX ) * (.22 + touchoffsetx) + 100 + touchoffset,
            y: scope.mouseDown ? 150 : ( -scope.mouseY ) * (.05 + touchoffsety) + 80 + (touchoffset/2),
            z: scope.mouseDown ? 700 : ( scope.mouseY ) * (.25 + touchoffsety) + 80 + (touchoffset/2),
            overwrite:true, 
        });

        scope.renderer.render( scope.scene, scope.camera );
    }

    onMouseMove(ev){
        scope.mouseX = ev.clientX - window.innerWidth / 2;
        scope.mouseY = ev.clientY - window.innerHeight / 2;
        // console.log(event.clientX )
    }

    onMouseDown(){
        scope.mouseDown = true;
    }

    onMouseUp(){
        scope.mouseDown = false;
    }

    onTouchStart( e ) {

        scope.touching = true;

        if ( e.touches.length === 1 ) {

        if(scope.touching){
            e.preventDefault();
            e.clientX = event.touches[ 0 ].pageX;
            e.clientY = event.touches[ 0 ].pageY;

            scope.mouseX = e.clientX + window.innerWidth / 2;
            scope.mouseY = e.clientY + window.innerHeight / 2;
        }
        }
    }

    onTouchEnd( e ) {
        scope.touching = false;
    }

    onTouchMove( e ) {

        e.stopPropagation();

        scope.touching = true;
        if ( e.touches.length === 1 ) {

        // e.preventDefault();

        e.clientX = e.touches[ 0 ].pageX;
        e.clientY = e.touches[ 0 ].pageY;

        scope.mouseX = e.clientX + window.innerWidth / 2;
        scope.mouseY = e.clientY + window.innerHeight / 2;
    
        }
    }

	componentDidMount() {
		this.posSet = true;

        this.init();
        
        window.onresize = this.onResize.bind(this);

        // TweenMax.to(scope.refs.canvas, 1, {alpha:1, delay:2,})
	}

    onResize()
    {
        this.SIZE = {
            w  : window.innerWidth ,
            w2 : window.innerWidth / 2,
            h  : window.innerHeight,
            h2 : window.innerHeight / 2
        };

        if(this.renderer) {
            this.renderer.setSize(this.SIZE.w, this.SIZE.h);
            this.camera.aspect = this.SIZE.w / this.SIZE.h;
            this.camera.updateProjectionMatrix();
            // this.camera.lookAt( this.scene.position );
        }
    }

	render() {
		const width = window.innerWidth; // canvas width
    	const height = window.innerHeight; // canvas height
		
		return (
		<div ref='canvas' style={{opacity:0}} />
	);
	}
}