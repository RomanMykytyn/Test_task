import './style/user.css';
import React, { useState, useEffect } from 'react';

export default function User(props) {

  const isFriend = props.authUser.friendship.includes(props.user._id);
  const isOutgoingReq = props.authUser.outgoingReq.includes(props.user._id);
  const isIncomingReq = props.authUser.incomingReq.includes(props.user._id);
  const isNewFriend = (!isFriend && !isOutgoingReq && !isIncomingReq);

  const clickHandler = (event) => {
    let json = {};
    if (event.target.value === 'Add friend') {
      json.from = props.authUser._id;
      json.to = props.user._id;
      sendReq('/friend/add', json);
    }
    if (event.target.value === 'Cancel request') {
      json.from = props.authUser._id;
      json.to = props.user._id;
      sendReq('/friend/cancelReq', json);
    }
    if (event.target.value === 'Accept') {
      json.from = props.user._id;
      json.to = props.authUser._id;
      sendReq('/friend/accept', json);
    }
    if (event.target.value === 'Ignore') {
      json.from = props.user._id;
      json.to = props.authUser._id;
      sendReq('/friend/ignore', json);
    }
    if (event.target.value === 'Remove friend') {
      json.from = props.authUser._id;
      json.to = props.user._id;
      sendReq('/friend/remove', json);
    }
  }

  const sendReq = (api, json) => {
    console.log(json);
    fetch(api, {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(json)
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.result === 'ok') {
          props.updateUsers(-1);
          props.updateAuthUser();
        }
      });
  }

  return (
    <div className='user-box'>
      <img src='/images/no_ava.jpg' alt='Oops' />
      <div className='name-box'>
        <h2>{props.user.name} {props.user.surname}</h2>
      </div>
      {isFriend &&
        <>
          <h3>friends</h3>
          <input type='button'
                 value='Remove friend'
                 className='btn'
                 onClick={clickHandler} />
        </>
      }
      {isOutgoingReq &&
        <>
          <h3>pending request</h3>
          <input type='button'
                 value='Cancel request'
                 className='btn'
                 onClick={clickHandler} />
        </>
      }
      {isIncomingReq &&
        <>
          <input type='button'
                 value='Accept'
                 className='btn'
                 onClick={clickHandler} />
          <input type='button'
                 value='Ignore'
                 className='btn'
                 onClick={clickHandler} />
        </>
      }
      {isNewFriend &&
        <>
          <h3></h3>
          <input type='button'
                 value='Add friend'
                 className='btn'
                 onClick={clickHandler} />
        </>
      }
    </div>
  );
}
