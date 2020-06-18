const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../schema/user.js');
const NUMBER_USERS = 10;


router.get('/', checkAuthentication, function(req, res) {
  res.sendFile(path.join(__dirname, '../public', 'app.html'));
});

router.get('/friends', checkAuthentication, function(req, res) {
  res.redirect('/user');
});

router.post('/getuser', checkAuthentication, function(req, res) {
  User.findById(req.cookies.id, function (err, user) {
    user.password = '';
    return res.json(user);
  });
});

router.post('/loadUsers', checkAuthentication, function(req, res) {
  //console.log(req.body);
  let limit = req.body.loadCount * NUMBER_USERS;
  User.countDocuments({}, function (err, count) {
    User.find({ _id: {$nin: req.cookies.id} }, null, { limit: limit }, function(err, docs) {
      let json = {number: count, list: docs};
      return res.json(json);
    });
  });
});

router.post('/search', checkAuthentication, function(req, res) {
  let keyword = req.body.searchStr.split(' ');
  console.log(keyword);
  if (keyword.length === 1) {
    let rExp = new RegExp(`${keyword[0]}`, 'i');
    User.find({$or: [{name: rExp}, {surname: rExp}]}, function(err, docs) {
      return res.json({list: docs});
    });
  }
  if (keyword.length >= 2) {
    let rExpName = new RegExp(`${keyword[0]}`, 'i');
    let rExpSurname = new RegExp(`${keyword[1]}`, 'i');
    User.find({ name: rExpName, surname: rExpSurname}, function(err, docs) {
      return res.json({list: docs});
    });
  }
});

router.get('/logout', checkAuthentication, function(req, res) {
  req.logout();
  res.redirect('/login');
});

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
      next();
    } else{
        res.redirect('/login');
    }
}



module.exports = router;
