const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');


router.get('/', function(req, res) {
  res.render('login', { msg: '' });
});



router.post('/', function(req, res, next) {
 passport.authenticate('local', function(err, user, info) {
   if (err) { return next(err); }
   if (!user) { return res.render('login', { msg: 'Wrong login or password' }); }
   req.logIn(user, function(err) {
     if (err) { return next(err); }
     res.cookie('id', user.id);
     return res.redirect('/user');
   });
 })(req, res, next);
});


module.exports = router;
