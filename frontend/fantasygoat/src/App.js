import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';

import CustomLayout from './containers/Layout';
import Stats from './containers/StatsView';


class App extends Component {
  render() {
    return (
      <div className="App">
        <CustomLayout>
          <Stats />
        </CustomLayout>
      </div>
    );
  }
}


export default App;
