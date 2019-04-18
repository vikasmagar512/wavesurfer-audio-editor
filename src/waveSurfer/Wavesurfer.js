import $ from "jquery";
import React, { Component } from "react";

import WaveSurferWaveform from "../components/waveSurferWaveform";
import contextRightClickModule from "../contextMenuRightClick";
class Wavesurferr extends Component {
  constructor(props){
    super(props);
    this.state = {
      playing: -1,
      // recordings:["./audio/Guitar30.mp3", "./audio/BassDrums30.mp3","./audio/Vocals30.mp3"],
      recordings:["https://wavesurfer-js.org/example/split-channels/stereo.mp3",
        "https://wavesurfer-js.org/example/split-channels/stereo.mp3",
        "./audio/BassDrums30.mp3",
        // "./audio/Vocals30.mp3"
      ],
    };
    this.changePlaying = this.changePlaying.bind(this);
  }
  changePlaying(id) {
    this.setState({
      playing: id,
    });
  }
  componentDidMount() {

  }

  render() {
      {/*<div className="container">
        <div className="wrapper">*/}
    return (
          <article className="post">
            <header className="post-header">
              <h1 className="post-title">Full Waveform Editor</h1>
              <p className="lead">Every control and state available.</p>
            </header>
            <div>
              <div className="post-content">
                {this.state.recordings && this.state.recordings.map((src,key)=>(
                  <WaveSurferWaveform key={key} id={key} src={src} playing={key === this.state.playing} onChange={this.changePlaying}/>
                ))}
              </div>
              <nav id="context-menu" className="context-menu">
                <ul className="context-menu__items">
                  <li className="context-menu__item">
                    <a href="#" className="context-menu__link" data-action="cut"><i className="fa fa-edit"/> Cut</a>
                  </li>
                  <li className="context-menu__item">
                    <a href="#" className="context-menu__link" data-action="paste"><i className="fa fa-times"/> Paste </a>
                  </li>
                  <li className="context-menu__item">
                    <a href="#" className="context-menu__link" data-action="copy"><i className="fa fa-eye"/> Copy</a>
                  </li>
                </ul>
              </nav>
            </div>
          </article>
    );
        /*</div>
      </div>*/
  }
}

export default Wavesurferr;
