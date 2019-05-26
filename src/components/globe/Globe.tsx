import React, { Component } from 'react';
import {
  AmbientLight,
  BackSide, BoxGeometry,
  Color,
  DirectionalLight,
  Geometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector2, Vector3,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Stats from "stats-js";
import { latLongToVector3 } from "../../shared/helpers";
import earthMap from "./textures/earth-map.jpg";
import earthNormalMap from "./textures/earth-normal-map.jpg";
import earthSpecularMap from "./textures/earth-specular-map.jpg";
import earthCloudsMap from "./textures/earth-clouds-map.png";
import galaxyMap from "./textures/galaxy-map.png";
import cities from "./data";

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
    this.camera.position.set(0, 0, 30);
    this.scene.background = new Color(0x000c1c);

    const ambientLight = new AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new DirectionalLight( 0xffffff, 0.1 );
    directionalLight.position.set(-1000, 500, 1000);
    this.scene.add(directionalLight);

    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    this.initControls();
    this.initGlobe();
    this.initCubes();
    this.animate();
  }

  initGlobe() {
    const loader = new TextureLoader();
    const texture = loader.load(earthMap);
    const normalTexture = loader.load(earthNormalMap);
    const specularTexture = loader.load(earthSpecularMap);
    const cloudsTexture = loader.load(earthCloudsMap);
    const galaxyTexture = loader.load(galaxyMap);

    this.globe = new Mesh(
      new SphereGeometry(15, 60, 60),
      new MeshPhongMaterial({
        map: texture,
        normalMap: normalTexture,
        normalScale: new Vector2(0.8, 0.7),
        specularMap: specularTexture,
        specular: new Color(0x262626),
        shininess: 10,
      }),
    );
    this.scene.add(this.globe);

    this.clouds = new Mesh(
      new SphereGeometry(15.02, 60, 60),
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

  async initCubes() {
    const geometry = new Geometry();
    const material = new MeshLambertMaterial({ color: 0x3333ff, opacity: 0.8, transparent: true, emissive: 0x262626 });

    cities.forEach((point: number[]) => {
      const lat = point[0] - 90.5 * -1;
      const lon = point[1] - 179.5;
      const population = point[2];
      const position = latLongToVector3(lat, lon, 15);
      const cube = new Mesh(new BoxGeometry(0.2, 0.2, population / 40000, 1, 1, 1), material);
      cube.position.copy(position);
      cube.lookAt(new Vector3(0, 0, 0));
      geometry.mergeMesh(cube);
    });

    const cubes = new Mesh(geometry, material);

    this.scene.add(cubes);
  }

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
    this.orbitControls.maxDistance = 100;
    this.orbitControls.minDistance = 30;
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

