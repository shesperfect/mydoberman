import React, { Component } from 'react';

import * as jsmediatags from 'jsmediatags';

import "./AudioPlayer.scss";

import doberman from './doberman.png';

export class AudioPlayer extends Component<PlayerProps> {
  state = {
    audioInfo: {
      artist: 'Unknown',
      title: 'No title',
      cover: '',
    },
    isPlaying: false,
  };

  audio: any;
  constructor(props: PlayerProps) {
    super(props);
  }

  toggle() {
    this.audio.paused ? this.audio.play() : this.audio.pause();
    this.setState({ isPlaying: !this.audio.paused });
  }

  onChange(e) {
    const file = e.target.files[0];
    jsmediatags.read(file, {
      onSuccess: res => {
        let cover = '';
        const image = res.tags.picture;
        if (image) {
          let base64String = '';
          for (let i = 0; i < image.data.length; i++) {
            base64String += String.fromCharCode(image.data[i]);
          }
          cover = 'data:' + image.format + ';base64,' +
            window.btoa(base64String);
        }
        this.setState({ audioInfo: { title: res.tags.title, artist: res.tags.artist, cover } });
      },
    });
    this.props.fileChanged(e);
  }

  render() {
    return (
      <div className="container">
        <audio src={ this.props.audioSrc } className="source-audio" ref={ node => this.audio = node }/>
        {!this.props.audioSrc ?
          <input type="file" onChange={ this.onChange.bind(this) }/> :
          <div className="audio-player">
            <div className="logo">
              <img src={ this.state.audioInfo.cover ? this.state.audioInfo.cover : doberman } alt=""/>
            </div>
            <div className="info">
              <div className="name">{ this.state.audioInfo.artist } - { this.state.audioInfo.title }</div>
              <div className="audio-controls">
                <div onClick={ this.toggle.bind(this) }>
                  { !this.state.isPlaying ?
                    <svg className="button" x="0px" y="0px" width="4.5px" height="6.9px"
                         viewBox="0 0 4.5 6.9">
                      <polyline className="button" points="0.6,0.3 3.9,3.4 0.6,6.6 "/>
                    </svg> :
                    <svg className="button" x="0px" y="0px" width="4.5px" height="6.9px"
                         viewBox="0 0 4.5 6.9">
                      <g>
                        <line className="st0" x1="0.4" y1="0.1" x2="0.4" y2="6.8"/>
                        <line className="st0" x1="4.1" y1="0.1" x2="4.1" y2="6.8"/>
                      </g>
                    </svg>
                  }
                </div>
                <div className="scale timeline">
                  <div className="play-head"/>
                </div>
                <div className="scale volume">
                  <div className="play-head"/>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

interface PlayerProps {
  fileChanged: any;
  audioSrc?: any;
}
