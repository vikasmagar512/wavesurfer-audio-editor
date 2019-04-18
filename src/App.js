import $ from "jquery";
import React, { Component } from "react";
import { HashRouter, NavLink, Route } from "react-router-dom";
import Wavesurferr from "./waveSurfer/Wavesurfer";
import WaveForm from "./components/Waveform";
import WaveSurferWaveform from "./components/waveSurferWaveform";

class App extends Component {

  render() {
    return (
      <div className="container">
        <div className="wrapper">
          <HashRouter>
            <ul className="header">
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/waveform">waveform</NavLink></li>
              <li><NavLink to="/waveSurfer">waveSurfer</NavLink></li>
            </ul>
            <div>
              <Route path="/" component={()=><p>Home</p>}/>
              <Route path="/waveform" component={WaveForm}/>
              <Route path="/waveSurfer" component={Wavesurferr}/>
              {/*<Route path="/waveSurfer" component={()=><WaveSurferWaveform src={'./audio/Guitar30.mp3'} pos={this.state.pos}*/}
                                                                           {/*onPosChange={this.handlePosChange}*/}
                                                                           {/*playing={this.props.playing}/>}/>*/}
            </div>
          </HashRouter>
        </div>
      </div>

    );
  }
}

export default App;
