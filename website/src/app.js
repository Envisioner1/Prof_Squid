import './styles.css';
import React from 'react';
import { render } from 'react-dom';
import Home from './pages/home';
import Login from './pages/login';


import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

require('font-awesome/css/font-awesome.css');

var root = document.createElement('div');
document.body.appendChild(root);

render(
  <Router>
    <div>
      <Route exact path="/" component={Login} />
      <Route path="/home" component={Home} />
    </div>
  </Router>,
  root
);
