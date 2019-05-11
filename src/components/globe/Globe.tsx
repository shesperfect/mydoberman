import React, { Component } from 'react';
import {
  AmbientLight, BackSide, Color, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial,
  PerspectiveCamera,
  Scene, SphereGeometry, TextureLoader,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Stats from "stats-js";
import earthMap from "./textures/earth-map.jpg";
import earthBumpMap from "./textures/earth-bump-map.jpg";
import earthCloudsMap from "./textures/earth-clouds-map.png";
import galaxyMap from "./textures/galaxy-map.png";

export class Globe extends Component {
  stats = new Stats();
  container: HTMLDivElement | null = null;
  renderer = new WebGLRenderer({ antialias: true });
  scene = new Scene();
  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
  orbitControls: any;
  globe: any;
  clouds: any;
  galaxy: any;

  componentDidMount(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.container && this.container.appendChild(this.renderer.domElement);
    this.camera.position.set(0, 0, 10);
    this.scene.background = new Color(0x000c1c);

    const ambientLight = new AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new DirectionalLight( 0xffffff, 0.1 );
    directionalLight.position.set(-1000, 500, 1000);
    this.scene.add(directionalLight);

    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    this.initControls();
    this.initGlobe();
    this.animate();
  }

  initGlobe() {
    const loader = new TextureLoader();
    const texture = loader.load(earthMap);
    const bumpTexture = loader.load(earthBumpMap);
    const cloudsTexture = loader.load(earthCloudsMap);
    const galaxyTexture = loader.load(galaxyMap);

    this.globe = new Mesh(
      new SphereGeometry(5, 60, 60),
      new MeshPhongMaterial({
        map: texture,
        bumpMap: bumpTexture,
        bumpScale: 0.9,
        shininess: 10,
      }),
    );
    this.scene.add(this.globe);

    this.clouds = new Mesh(
      new SphereGeometry(5.01, 60, 60),
      new MeshPhongMaterial({
        map: cloudsTexture,
        transparent: true
      })
    );
    this.scene.add(this.clouds);

    this.galaxy = new Mesh(
      new SphereGeometry(60, 80, 80),
      new MeshBasicMaterial({
        map: galaxyTexture,
        side: BackSide
      })
    );
    this.scene.add(this.galaxy);
  };

  animate () {
    requestAnimationFrame(this.animate.bind(this));
    this.stats.update();
    this.globe.rotation.y += 0.0005;
    this.clouds.rotation.y += 0.0004;
    this.galaxy.rotation.y -= 0.0001;
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  };

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.rotateSpeed = 0.1;
    this.orbitControls.zoomSpeed = 0.3;
    this.orbitControls.maxDistance = 40;
    this.orbitControls.minDistance = 7;
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.1;
    this.container && this.container.appendChild(this.stats.domElement);
  }

  render() {
    return (
      <div ref={el => this.container = el}/>
    );
  }
}

