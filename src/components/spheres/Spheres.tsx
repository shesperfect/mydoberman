import React, { Component } from 'react';
import smoke from './textures/smoke.png';
import {
  AmbientLight,
  Clock, Color, Fog,
  Mesh, MeshLambertMaterial,
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

const DISTANCE = 50;

export class Spheres extends Component {
  stats = new Stats();
  gui = new GUI();
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

    const ambientLight = new AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const fogColor = 0xf9b1bc;
    this.scene.background = new Color(fogColor);
    this.scene.fog = new Fog(fogColor, 1, 1000);

    // const directionalLight = new DirectionalLight( 0xffffff, 0.5 );
    // directionalLight.position.set(-1, 0, 100);
    // this.scene.add(directionalLight);

    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    this.initControls();
    initThreeHelpers(this.scene, 50);
    this.initSmoke();
    this.initSpheres();
    this.animate();
  }

  componentWillUnmount(): void {
    this.gui.destroy();
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
      for (let i = 0; i < 35; i++) {
        const particle = new Mesh(geometry, material);
        particle.position.set(Math.random() * 100 - 50, Math.random() * 80 - 40, -Math.random() * 80);
        particle.rotation.z = Math.random() * 360;
        this.scene.add(particle);
        this.smokeParticles.push(particle);
      }
    });
  }

  initSpheres() {
    const sphereGeometry1 = new SphereBufferGeometry(15, 60, 60);
    const sphereMaterial1 = new MeshLambertMaterial({ color: 0x26619c, opacity: 0.6, wireframe: true });
    const sphere1 = new Mesh(sphereGeometry1, sphereMaterial1);
    this.scene.add(sphere1);

    const sphereGeometry2 = new SphereBufferGeometry(12, 40, 40);
    const sphereMaterial2 = new MeshLambertMaterial({ color: 0xcc2004, wireframe: true });
    const sphere2 = new Mesh(sphereGeometry2, sphereMaterial2);
    sphere2.position.set(35 , -10, -20);
    this.scene.add(sphere2);
  }

  rotateSmoke(delta: number) {
    for (let i = 0; i < this.smokeParticles.length; i++) {
      this.smokeParticles[i].rotation.z += (delta * 0.2);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initControls() {
    new OrbitControls(this.camera, this.renderer.domElement);
    const moveSmokeButton = {
      moveSmoke: () => {
       this.smokeMoving = !this.smokeMoving;
      }
    };
    this.gui.add(moveSmokeButton, 'moveSmoke');
    this.container && this.container.appendChild(this.stats.domElement);
  }

  render() {
    return (
      <div ref={el => this.container = el}/>
    );
  }
}
