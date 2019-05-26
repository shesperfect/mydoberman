import React, { Component } from 'react';
import {
  AmbientLight, Color,
  PerspectiveCamera, PlaneBufferGeometry, Points, PointsMaterial,
  Scene,
  WebGLRenderer,
  AudioListener,
  Audio,
} from "three";
import * as Stats from "stats-js";
import { AudioPlayer } from "./audioplayer/AudioPlayer";

const WAVES_NUM = 30;
const PANE_WIDTH = 100;
const PANE_HEIGHT = 100;

export class SoundWave extends Component {
  state = {
    audioSrc: null,
  };

  stats = new Stats();
  container: HTMLDivElement | null = null;
  renderer = new WebGLRenderer({ alpha: true });
  scene = new Scene();
  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  listener = new AudioListener();
  audio = new Audio(this.listener);

  audioContext;
  analyser;
  bufferLength;
  dataArray;
  sourceNode;

  componentDidMount(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.container && this.container.appendChild(this.renderer.domElement);
    this.camera.position.set(0, 0, 90);

    this.scene.background = new Color(0x000000);

    const ambientLight = new AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    this.initControls();
    this.initPane();
    this.animate();
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this));
    this.stats.update();
    this.updateGraphs();
    this.renderer.render(this.scene, this.camera);
  };

  initPane() {

  }

  private fileChanged(event: Event) {
    const reader = new FileReader();
    const audioFile = (event.target as any).files[0];
    reader.readAsArrayBuffer(audioFile);
    reader.onload = () => {
      this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.sourceNode = this.audioContext.createBufferSource();
      this.setState({ audioSrc: URL.createObjectURL(audioFile) });

      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      this.analyser.fftSize = 256;

      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
    }
  }
  private updateGraphs() {
    if (this.audioContext) {
      this.analyser.getByteFrequencyData(this.dataArray);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initControls() {
    // this.container && this.container.appendChild(this.stats.domElement);
  }

  render() {
    return (
      <div ref={el => this.container = el}>
        <AudioPlayer audioSrc={ this.state.audioSrc } fileChanged={this.fileChanged.bind(this)} />
      </div>
    );
  }
}
