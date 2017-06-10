import React, { Component } from 'react';
import logo from './assets/images/logo.svg';
import Video from './components/video';
import './assets/css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>EDI-CAM</h2>
        </div>
        <p className="App-intro">
          <Video />
        </p>
      </div>
    );
  }
}

export default App;
