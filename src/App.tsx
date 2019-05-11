import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Home from "./home/Home";
import { Spheres, Terrain, Globe } from "./components";

import "./App.scss";

const App: React.FC = () => {
  return (
      <Router>
        <Link className="back" to="/">Back</Link>
        <Route path="/" exact component={Home} />
        <Route path="/spheres" component={Spheres} />
        <Route path="/terrain" component={Terrain} />
        <Route path="/globe" component={Globe} />
      </Router>
  );
};

export default App;
