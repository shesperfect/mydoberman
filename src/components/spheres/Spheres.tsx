import React, { Component } from 'react';
import './Spheres.scss';
import { Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, SphereBufferGeometry, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Stats from "stats-js";
import { GUI } from "dat.gui";
import { initThreeHelpers } from "../../shared/helpers";

const RADIUS = 10;
const DISTANCE = 50;

export default class Spheres extends Component {
  stats = new Stats();
  container: HTMLDivElement | null = null;
  renderer = new WebGLRenderer({ alpha: true });
  scene = new Scene();
  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

  componentDidMount(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.container && this.container.appendChild(this.renderer.domElement);
    this.camera.position.set(0, 0, DISTANCE);

    const sphereGeometry = new SphereBufferGeometry(RADIUS, RADIUS * 2, RADIUS * 5);
    const sphereMaterial = new MeshNormalMaterial();
    sphereMaterial.opacity = 0.7;
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(sphere);

    this.initControls();
    initThreeHelpers(this.scene, 50);
    this.animate();
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this));
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
  };

  initControls() {
    new OrbitControls(this.camera, this.renderer.domElement);
    new GUI();
    this.container && this.container.appendChild(this.stats.domElement);
  }

  render() {
    return (
      <div ref={el => this.container = el}/>
    );
  }
};
