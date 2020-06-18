import './style/main.css';
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { NavLink } from 'react-router-dom';
import ListUsers from './listUsers.js';
import Friends from './friends.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch('/user/getuser', {method: 'POST'})
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUser(data);
      });
  }, []);

  return (
    <>
      <nav>
        <ul>
          <li><NavLink to='/user' exact className='nav-elem'>Users</NavLink></li>
          <li><NavLink to='/user/friends' className='nav-elem'>Friends</NavLink></li>
          <li><a className='hello-msg'>Hello, {user.name} {user.surname}!</a></li>
          <li><a className='exit-btn nav-elem' href='/user/logout'>Exit</a></li>
        </ul>
      </nav>
      <Route exact path='/user' render={props => <ListUsers {...props} /> } />

      <Route path='/user/friends' render={props => <Friends {...props} authUser={user} /> } />
    </>
  );
}


render(
      <Router>
        <App />
      </Router>, document.getElementById('root')
);
