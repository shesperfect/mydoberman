import React, { Component } from 'react';
import './Spheres.scss';
import smoke from './textures/smoke.png';
import {
  Clock, DirectionalLight,
  Mesh, MeshLambertMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  SphereBufferGeometry, TextureLoader,
  WebGLRenderer
} from "three";
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
  clock = new Clock();
  smokeParticles: Mesh[] = [];
  smokeMoving = false;

  componentDidMount(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.container && this.container.appendChild(this.renderer.domElement);
    this.camera.position.set(0, 0, DISTANCE);

    const directionalLight = new DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(-1, 0, 100);
    this.scene.add(directionalLight);

    const sphereGeometry = new SphereBufferGeometry(RADIUS, RADIUS * 2, RADIUS * 5);
    const sphereMaterial = new MeshNormalMaterial({ wireframe: true });
    sphereMaterial.opacity = 0.7;
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(sphere);

    this.initControls();
    initThreeHelpers(this.scene, 50);
    this.initSmoke();
    this.animate();
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this));
    this.stats.update();
    this.smokeMoving && this.rotateSmoke(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);
  };

  initSmoke() {
    const geometry = new PlaneBufferGeometry(70, 70);
    const material = new MeshLambertMaterial({ color: 0xf9b1bc, emissive: 0xff7373, opacity: 0.6, transparent: true });
    new TextureLoader().load(smoke, texture => {
      material.map = texture;
      for (let i = 0; i < 15; i++) {
        const particle = new Mesh(geometry, material);
        particle.position.set(Math.random() * 100 - 50, Math.random() * 80 - 40, -Math.random() * 80);
        particle.rotation.z = Math.random() * 360;
        this.scene.add(particle);
        this.smokeParticles.push(particle);
      }
    });
  }

  rotateSmoke(delta: number) {
    for (let i = 0; i < this.smokeParticles.length; i++) {
      this.smokeParticles[i].rotation.z += (delta * 0.2);
    }
  }

  initControls() {
    new OrbitControls(this.camera, this.renderer.domElement);
    const gui = new GUI();
    const moveSmokeButton = {
      moveSmoke: () => {
       this.smokeMoving = !this.smokeMoving;
      }
    };
    gui.add(moveSmokeButton, 'moveSmoke');
    this.container && this.container.appendChild(this.stats.domElement);
  }

  render() {
    return (
      <div ref={el => this.container = el}/>
    );
  }
};
