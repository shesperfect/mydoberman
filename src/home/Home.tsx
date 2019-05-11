import React from 'react';
import './Home.scss';
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/spheres">Spheres</Link>
        </li>
        <li>
          <Link to="/globe">Globe</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
