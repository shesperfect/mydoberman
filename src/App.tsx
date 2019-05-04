import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.scss';
import Spheres from "./components/spheres/Spheres";
import Home from "./home/Home";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Home} />
        <Route path="/spheres" component={Spheres} />
      </div>
    </Router>
  );
};

export default App;
