const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../schema/user.js');

router.post('/add', checkAuthentication, function(req, res) {
  User.findById(req.body.from, function (err, doc) {
    doc.outgoingReq.push(req.body.to);
    User.findById(req.body.to, function (err, doc) {
      doc.incomingReq.push(req.body.from);
      doc.save();
    });
    doc.save();
    return res.json({result: 'ok'});
  });
});

router.post('/cancelReq', checkAuthentication, function(req, res) {
  User.findById(req.body.from, function (err, doc) {
    let index = doc.outgoingReq.indexOf(req.body.from);
    doc.outgoingReq.splice(index, 1);
    User.findById(req.body.to, function (err, doc) {
      let index_2 = doc.incomingReq.indexOf(req.body.to);
      doc.incomingReq.splice(index_2, 1);
      doc.save();
    });
    doc.save();
    return res.json({result: 'ok'});
  });
});

router.post('/accept', checkAuthentication, function(req, res) {
  User.findById(req.body.to, function (err, doc) {
    let index = doc.incomingReq.indexOf(req.body.from);
    doc.incomingReq.splice(index, 1);
    doc.friendship.push(req.body.from);
    User.findById(req.body.from, function (err, doc) {
      let index_2 = doc.outgoingReq.indexOf(req.body.to);
      doc.outgoingReq.splice(index_2, 1);
      doc.friendship.push(req.body.to);
      doc.save();
    });
    doc.save();
    return res.json({result: 'ok'});
  });
});

router.post('/ignore', checkAuthentication, function(req, res) {
  User.findById(req.body.to, function (err, doc) {
    let index = doc.incomingReq.indexOf(req.body.from);
    doc.incomingReq.splice(index, 1);
    User.findById(req.body.from, function (err, doc) {
      let index_2 = doc.outgoingReq.indexOf(req.body.to);
      doc.outgoingReq.splice(index_2, 1);
      doc.save();
    });
    doc.save();
    return res.json({result: 'ok'});
  });
});

router.post('/remove', checkAuthentication, function(req, res) {
  User.findById(req.body.from, function (err, doc) {
    let index = doc.friendship.indexOf(req.body.to);
    doc.friendship.splice(index, 1);
    User.findById(req.body.to, function (err, doc) {
      let index_2 = doc.friendship.indexOf(req.body.from);
      doc.friendship.splice(index_2, 1);
      doc.save();
    });
    doc.save();
    return res.json({result: 'ok'});
  });
});

router.post('/getAll', checkAuthentication, function(req, res) {
  let json = {};
  User.findById(req.body.id, function (err, doc) {
    User.find( { '_id': { $in: doc.outgoingReq} }, function(err, docs) {
      //console.log(docs);
      json.outgoingReq = docs;
      User.find( { '_id': { $in: doc.incomingReq} }, function(err, docs) {
        //console.log(docs);
        json.incomingReq = docs;
        User.find( { '_id': { $in: doc.friendship} }, function(err, docs) {
          //console.log(docs);
          json.friendship = docs;
          console.log(json);
          return res.json(json);
        });
      });
    });
  });
});


function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
      next();
    } else{
        res.redirect('/login');
    }
}

module.exports = router;
