import './style/friends.css';
import React, { useState, useEffect } from 'react';
import User from './user.js';

export default function Friends(props) {
  const [listsUsers, setListsUsers] = useState({incomingReq: [],
                                                outgoingReq: [],
                                                friendship: []
                                              });
  const [authUser, setAuthUser] = useState({});

  useEffect ( () => {
    updateUsers();
    loadAuthUser();
  }, []);

  const updateUsers = () => {
    fetch('/friend/getAll', {method: 'POST',
                             headers: {'Content-Type': 'application/json'},
                             body: JSON.stringify({id: props.authUser._id})
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setListsUsers(data);
      });
  }

  const loadAuthUser = () => {
    fetch('/user/getuser', {method: 'POST'})
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAuthUser(data);
      });
  }

  return (
    <div className='friends-box'>
      <div>
        <h1>Pending request</h1>
        <h2>Incoming</h2>
        {!listsUsers.incomingReq.length &&
          <p><i>You don't have any request</i></p>
        }
        {listsUsers.incomingReq.map(el => (<User authUser={authUser}
                                                 key={el._id}
                                                 updateUsers={updateUsers}
                                                 updateAuthUser={loadAuthUser}
                                                 user={el} />))}
        <h2>Outgoing</h2>
        {!listsUsers.outgoingReq.length &&
          <p><i>You don't have any request</i></p>
        }
        {listsUsers.outgoingReq.map(el => (<User authUser={authUser}
                                                 key={el._id}
                                                 updateUsers={updateUsers}
                                                 updateAuthUser={loadAuthUser}
                                                 user={el} />))}
        <hr />
        <h1>Friends</h1>
        {!listsUsers.friendship.length &&
          <p><i>You don't have any friend</i></p>
        }
        {listsUsers.friendship.map(el => (<User authUser={authUser}
                                                key={el._id}
                                                updateUsers={updateUsers}
                                                updateAuthUser={loadAuthUser}
                                                user={el} />))}
      </div>
    </div>
  );
}
