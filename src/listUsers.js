import './style/listUsers.css';
import React, { useState, useEffect } from 'react';
import User from './user.js';

export default function ListUsers(props) {
  const [listUsers, setListUsers] = useState([]);
  const [totalNumUsers, setTotalNumUsers] = useState(0);
  const [loadCount, setLoadCount] = useState(2);
  const [isSearch, setIsSearch] = useState(false);
  const [authUser, setAuthUser] = useState({});
  const [searchStr, setSearchStr] = useState('');


  useEffect(() => {
    //loadUsers();
    //setLoadCount(loadCount + 1);
    loadAuthUser();
  }, []);

  useEffect(() => {
    if (!isSearch) {
      //let shift = loadCount - 1 > 0 ? -1 : 0;
      loadUsers(-1);
      //setLoadCount(loadCount + 1);
    }
  }, [isSearch]);

  const handleScroll = (event) => {
    if (isSearch) {
      return;
    }
    let element = document.getElementById("list");
    if(element.scrollHeight - Math.ceil(element.scrollTop) === element.clientHeight) {
     if (listUsers.length + 1 < totalNumUsers) {
       loadUsers();
       setLoadCount(loadCount + 1);
     }
    }
  }

  const loadUsers = (shift = 0) => {
    console.log(loadCount);
    let apiAddress = isSearch ? '/user/search' : '/user/loadUsers';
    let json = isSearch ? {searchStr: searchStr} : {loadCount: loadCount + shift};
    fetch(apiAddress, {method: 'POST',
                       headers: {'Content-Type': 'application/json'},
                       body: JSON.stringify(json)
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setTotalNumUsers(data.number);
        setListUsers(data.list);
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

  const search = (event) => {
    setSearchStr(event.target.value);
    if (!event.target.value) {
      setIsSearch(false);
      return;
    }
    fetch('/user/search', {method: 'POST',
                           headers: {'Content-Type': 'application/json'},
                           body: JSON.stringify({searchStr: event.target.value})
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setListUsers(data.list);
        setIsSearch(true);
        //setLoadCount(1);
      });
  }


  return (
    <div className='list-box' onScroll={handleScroll} id='list'>
    <input onChange={search} />
    {listUsers.map(el => (<User authUser={authUser}
                                key={el._id}
                                updateUsers={loadUsers}
                                updateAuthUser={loadAuthUser}
                                user={el} />))}
    </div>
  );
}
