import React, { Component } from 'react';
import {
  AmbientLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Stats from "stats-js";
import { initThreeHelpers } from "../../shared/helpers";

export class Terrain extends Component {
  stats = new Stats();
  container: HTMLDivElement | null = null;
  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  scene = new Scene();
  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

  componentDidMount(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.container && this.container.appendChild(this.renderer.domElement);
    this.camera.position.set(0, 0, -100);

    const ambientLight = new AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    // const directionalLight = new DirectionalLight( 0xffffff, 0.5 );
    // directionalLight.position.set(-1, 0, 100);
    // this.scene.add(directionalLight);

    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    this.initControls();
    initThreeHelpers(this.scene, 50);
    this.animate();
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this));
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
  };

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initControls() {
    new OrbitControls(this.camera, this.renderer.domElement);
    this.container && this.container.appendChild(this.stats.domElement);
  }

  render() {
    return (
      <div ref={el => this.container = el}/>
    );
  }
}
